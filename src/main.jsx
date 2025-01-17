import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ThemeProvider } from "@/components/ThemeProvider.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </Provider>
);
