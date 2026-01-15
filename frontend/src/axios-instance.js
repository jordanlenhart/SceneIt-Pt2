import axios from "axios";
import supabase from "./client";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const navigate = useNavigate();


/// attached Supabase access_token to every request automatically
api.interceptors.request.use(
  async (config) => {
    /// gets the current session from Supabase (auto-refreshes)
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


/// log user out and redirect them to AuthPage '/auth' if 
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      /// clears the Supabase session
      await supabase.auth.signOut();

      /// redirects user
      navigate('/auth');
    }
    return Promise.reject(error);
  }
);

export default api;
