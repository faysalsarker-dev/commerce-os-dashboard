import React, { createContext, useContext, useEffect, useState } from "react";
import { socket } from "@/lib/apis/socket";
import { useGetProfileQuery } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hooks";
import { baseApi } from "@/redux/baseApi";
import { toast } from "sonner";
import type { Socket } from "socket.io-client";
import { useAuth } from "@/hooks/auth/useAuth";

export interface StockUpdatePayload {
  variantId: string;
  productId?: string;
  productName?: string;
  colorName?: string;
  size?: string;
  stockQty: number;
  movementType: "SALE_OUT" | "RETURN_IN";
  updatedAt: string;
}

export interface UserPresencePayload {
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  image?: string | null;
  isOnline: boolean;
  lastSeenAt?: string;
}

interface SocketContextValue {
  socket: Socket;
  isConnected: boolean;
  onlineUsers: Map<string, UserPresencePayload>;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, UserPresencePayload>>(new Map());
const {user,isAuthenticated}=useAuth()


  useEffect(() => {
    if (!isAuthenticated) {
      if (socket.connected) {
        socket.disconnect();
      }
      setIsConnected(false);
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    let heartbeatInterval: ReturnType<typeof setInterval> | null = null;

    const onConnect = () => {
      setIsConnected(true);
      // Emit initial heartbeat
      console.log('socket connected')
      socket.emit("presence:heartbeat");

      // Set up periodic heartbeat every 30 seconds
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      heartbeatInterval = setInterval(() => {
        if (socket.connected) {
          socket.emit("presence:heartbeat");
        }
      }, 30000);
    };

    const onDisconnect = () => {
      setIsConnected(false);
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
    };

    const onStockUpdate = (payload: StockUpdatePayload) => {
      // Invalidate product and sales RTK query cache so components re-render with fresh stock
      dispatch(baseApi.util.invalidateTags(["PRODUCT", "SALES"]));

      const itemDesc = [payload.productName, payload.colorName, payload.size].filter(Boolean).join(" - ");
      toast.info(`Stock updated: ${itemDesc || "Product"} (Qty: ${payload.stockQty})`, {
        description: `Movement: ${payload.movementType === "SALE_OUT" ? "Sale" : "Return"}`,
        id: `stock-update-${payload.variantId}`,
      });
    };

    const onPresenceStatus = (payload: UserPresencePayload) => {
      setOnlineUsers((prev) => {
        const next = new Map(prev);
        if (payload.userId) {
          next.set(payload.userId, payload);
        }
        return next;
      });
    };

    const onConnectError = (err: Error) => {
      console.warn("Socket connection warning:", err.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("stock:update", onStockUpdate);
    socket.on("presence:status", onPresenceStatus);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("stock:update", onStockUpdate);
      socket.off("presence:status", onPresenceStatus);
    };
  }, [isAuthenticated,  dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextValue => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
