// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ReportScreen from "./screens/ReportScreen";
import RouteScreen from "./screens/RouteScreen";
import SplashScreen from "./screens/SplashScreen";
import OnboardScreen from "./screens/OnboardScreen";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/onboard" element={<OnboardScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/search" element={<SearchScreen />} />
      <Route path="/report" element={<ReportScreen />} />
      <Route path="/route" element={<RouteScreen />} />
    </Routes>
  );
}
