// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ReportScreen from "./screens/ReportScreen";
import RouteScreen from "./screens/RouteScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ReportScreen />} />
      <Route path="/route" element={<RouteScreen />} />
    </Routes>
  );
}
