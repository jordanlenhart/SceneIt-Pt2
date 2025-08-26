import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import Shows from "./pages/Shows.jsx";
// import Playlists from "./pages/Playlists.jsx";
import Search from "./pages/Search.jsx";
import ShowPage from "./pages/ShowPage.jsx";

// LOGIN IMPORT 
import Login from "./pages/Login.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shows" element={<Shows />} />
        {/* <Route path="/playlists" element={<Playlists />} /> */}
        <Route path="/search" element={<Search />} />
        <Route path="/show/:id" element={<ShowPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);