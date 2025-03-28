import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AllJokes from "./Pages/Dashboard/AllJokes";
import { JokesProvider } from "./Pages/JokesContext";

function App() {
  return (
    <JokesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/all-jokes" element={<AllJokes />} />
        </Routes>
      </Router>
    </JokesProvider>
  );
}

export default App;
