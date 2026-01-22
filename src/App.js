import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapView from "./components/MapView";
import AdminPage from "./components/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapView />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
