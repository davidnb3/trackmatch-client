import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import Login from "./Login.js";
const code = new URLSearchParams(window.location.search).get("code");

ReactDOM.render(
  <ChakraProvider>{code ? <App code={code} /> : <Login />}</ChakraProvider>,
  document.getElementById("root")
);
