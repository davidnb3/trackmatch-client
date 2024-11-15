import { useState, useEffect } from "react";

const useAuth = () => {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("spotifyAccessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );

  const expiresIn = localStorage.getItem("expiresIn");

  const [hasToken, setHasToken] = useState(!!accessToken);

  useEffect(() => {
    const redirectUri = "http://127.0.0.1:5173/";
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    const body = {
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      state,
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

      fetch("http://localhost:3001/auth/refreshToken", {
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
          localStorage.setItem("expiresIn", data.expiresIn);
          setAccessToken(data.accessToken);
        })
        .catch((error) => console.error(error));
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

  return { accessToken, refreshToken, hasToken };
};

export default useAuth;
