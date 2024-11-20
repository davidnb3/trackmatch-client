import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserData } from "@/store/userSlice.js";

const useAuth = () => {
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("spotifyAccessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );

  const [userData, setUserData] = useState(null);

  const expiresIn = localStorage.getItem("expiresIn");

  const [hasToken, setHasToken] = useState(!!accessToken);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await dispatch(getUserData(accessToken)).unwrap();
        setUserData(user.user);
      } catch (error) {
        if (error.message === "Unauthorized") {
          try {
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
              const user = await dispatch(getUserData(newAccessToken)).unwrap();
              setUserData(user.user);
            }
          } catch (refreshError) {
            console.error(refreshError);
          }
        } else {
          console.error(error);
        }
      }
    };

    if (accessToken) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    const redirectUri = "http://127.0.0.1:5173/";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    // const state = params.get("state");

    const body = {
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    };

    if (code) {
      // Send a request to the server to get the access token
      fetch("http://localhost:3001/auth/getToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("spotifyAccessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("expiresIn", data.expiresIn);
          setAccessToken(data.accessToken);
          setRefreshToken(data.refreshToken);
          setHasToken(true);
          window.location.href = "/";
        })
        .catch((error) => console.error(error));
    }
  }, []);

  const refreshAccessToken = async () => {
    if (refreshToken) {
      const body = {
        refreshToken,
      };

      try {
        const response = await fetch(
          "http://localhost:3001/auth/refreshToken",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        localStorage.setItem("spotifyAccessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("expiresIn", data.expiresIn);
        setAccessToken(data.accessToken);
        return data.accessToken;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  };

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    if (expiresIn) {
      const timeout = setInterval(() => {
        refreshAccessToken();
      }, (expiresIn - 60) * 1000); // Refresh the token 1 minute before it expires

      return () => clearInterval(timeout);
    }
  }, [refreshToken, expiresIn]);

  return { accessToken, refreshToken, hasToken, refreshAccessToken, userData };
};

export default useAuth;
