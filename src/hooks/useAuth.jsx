import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserData } from "@/store/userSlice.js";

const useAuth = () => {
  const dispatch = useDispatch();
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("spotifyAccessToken")
  );

  const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwtToken"));

  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );

  const [userData, setUserData] = useState(null);
  const [hasAccessToken, setHasAccessToken] = useState(!!accessToken);

  const fetchUserData = async () => {
    try {
      const user = await dispatch(getUserData(accessToken)).unwrap();
      localStorage.setItem("jwtToken", user.token);
      setJwtToken(user.token);
      setUserData(user.user);
    } catch (error) {
      if (error.message === "Unauthorized") {
        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            const user = await dispatch(getUserData(newAccessToken)).unwrap();
            localStorage.setItem("jwtToken", user.token);
            setJwtToken(user.token);
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

  const fetchSpotifyToken = async (code) => {
    const redirectUri = "http://127.0.0.1:5173/";
    const body = {
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    };

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
        setHasAccessToken(true);
        window.location.href = "/";
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (accessToken) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      fetchSpotifyToken(code);
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

  return {
    accessToken,
    refreshToken,
    hasAccessToken,
    refreshAccessToken,
    userData,
    jwtToken,
  };
};

export default useAuth;
