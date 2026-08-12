import { io, Socket } from "socket.io-client";

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

export function getAccessToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("accessToken") || getCookie("accessToken");
}

export const getSocketUrl = (): string => {
  const envSocketUrl = import.meta.env.VITE_API_SOCKET_URL;
  if (envSocketUrl && envSocketUrl.trim()) {
    let url = envSocketUrl.trim();
    if (url.startsWith("wss://")) {
      url = url.replace(/^wss:\/\//, "https://");
    } else if (url.startsWith("ws://")) {
      url = url.replace(/^ws:\/\//, "http://");
    }
    return url;
  }
  const envApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
  return envApiUrl.replace(/\/api\/v1\/?$/, "");
};

export const socket: Socket = io(getSocketUrl(), {
  autoConnect: false,
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  auth: (cb) => {
    const token = getAccessToken();
    cb({ token });
  },
});