import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import Signup from "./Components/Signup/Signup";
import Login from "./Components/Login/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
