import React from "react";
import { UserProvider } from './context/UserContext';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import AuthPage from './pages/AuthPage.jsx';
import Search from "./pages/Search.jsx";
import ShowPage from "./pages/ShowPage.jsx";
import ProfilePage from './pages/ProfilePage.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/show/:id" element={<ShowPage />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);