import Home from "./pages/home.jsx";
import Browse from "./pages/browse.jsx";
import { DndContext } from "@dnd-kit/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export const metadata = {
  title: "Music App",
  description: "Example music app using the components.",
};

export default function App() {
  return (
    <DndContext>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
        </Routes>
      </Router>
    </DndContext>
  );
}
