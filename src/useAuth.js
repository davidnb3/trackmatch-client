import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  //___SENDS AUTH CODE TO API TO GET BACK ACCESSTOKEN & REFRESHTOKEN
  useEffect(() => {
    axios
      .post("http://localhost:3001/login", {
        // AUTH code which is extracted from URL params
        code,
      })
      .then((res) => {
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
        // Remove URL parameter
        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        window.location = "/";
      });
  }, [code]);

  //__AUTOMATICALLY SENDS REFRESHTOKEN TO API TO GET BACK A NEW ACCESSTOKEN
  useEffect(() => {
    // Avoid API call before there's a refreshToken and expiresIn
    if (!refreshToken || !expiresIn) return;
    // Interval to always call API one minute before accessToken expires
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch((err) => {
          console.log(err);
        });
    }, (expiresIn - 60) * 1000);
    return () => clearInterval(interval);
    // Sending refresh code to the server
  }, [refreshToken, expiresIn]);

  return accessToken;
}
