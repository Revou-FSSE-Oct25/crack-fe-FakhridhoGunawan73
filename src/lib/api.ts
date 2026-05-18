import axios from "axios";
import { clearAccessTokenCookie } from "./storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const protectedRoutes = [
  "/profile",
  "/my-bookings",
  "/owner",
  "/bookings/create",
];

function isProtectedPath(pathname: string) {
  return protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearAccessTokenCookie();
      const path = window.location.pathname;

      if (
        isProtectedPath(path) &&
        !path.startsWith("/login") &&
        !path.startsWith("/register")
      ) {
        window.location.href = `/login?next=${encodeURIComponent(path)}`;
      }
    }
    return Promise.reject(error);
  },
);

export default api;