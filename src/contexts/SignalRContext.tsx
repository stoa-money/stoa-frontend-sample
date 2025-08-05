import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useAuth, useSession, useUser } from '@clerk/nextjs';
import { notificationService } from '@/api/notificationService';
import { useUserStore } from '@/store/userStore';
import {
  UserNotificationStatus,
  VerificationNotificationStatus,
} from '@/types/notification';

interface SignalRContextType {
  isConnected: boolean;
  connect: (userId: string) => Promise<void>;
  disconnect: () => Promise<void>;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export function SignalRProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { session } = useSession();
  const { getToken } = useAuth();

  const {
    userId,
    setUserBankAccount,
    setUserId,
    setUserNotificationStatus,
  } = useUserStore();
  
  const connectionInitialized = useRef(false);
  const isConnected = notificationService.isConnected();

  // Set userId from Clerk when available
  useEffect(() => {
    if (user && user.publicMetadata.stoaId && !userId) {
      setUserId(user.publicMetadata.stoaId as string);
    }
  }, [user, userId, setUserId]);

  // Global SignalR connection management
  useEffect(() => {
    if (!userId || connectionInitialized.current) return;

    const initializeConnection = async () => {
      try {
        await user?.reload();
        await notificationService.connect(getToken);
        connectionInitialized.current = true;
        console.log("✅ [SignalR] Global connection established for user:", userId);
      } catch (error) {
        console.error("❌ [SignalR] Failed to establish global connection:", error);
      }
    };

    const handleDataUpdate = async (notification: any) => {
      const { status, data, type } = notification;

      if (type === "user") {
        switch (status) {
          case "user-verification-in-progress":
          case "user-verified":
          case "user-rejected":
          case "user-created":
          case "user-ready-to-verify":
            setUserNotificationStatus(status as VerificationNotificationStatus);
            break;
          case "user-active":
            setUserNotificationStatus(status as UserNotificationStatus);
            setUserBankAccount(undefined);
            break;
          case "user-idv-check-created":
          case "user-account-authorization-requested":
          case "user-ready-to-deposit":
            setUserNotificationStatus(status as UserNotificationStatus);
            if (status === "user-ready-to-deposit") {
              setUserBankAccount(data?.bankAccount);
            }
            break;
        }
      }
      // Note: Pot notifications can still be handled in specific components
    };

    initializeConnection();
    
    notificationService.on("DataUpdate", handleDataUpdate);

    return () => {
      notificationService.off("DataUpdate", handleDataUpdate);
    };

  }, [userId]);

  // Cleanup on user logout
  useEffect(() => {
    if (!user && connectionInitialized.current) {
      notificationService.disconnect();
      connectionInitialized.current = false;
      console.log("🔌 [SignalR] Connection closed due to user logout");
    }
  }, [user]);

  const connect = async () => {
    await user?.reload();
    await session?.reload();

    console.log("🔌 [SignalR] Reloaded user and session inside connect");

    await notificationService.connect(getToken);
  };

  const disconnect = async () => {
    await notificationService.disconnect();
    connectionInitialized.current = false;
  };

  const value: SignalRContextType = {
    isConnected,
    connect,
    disconnect,
  };

  return (
    <SignalRContext.Provider value={value}>
      {children}
    </SignalRContext.Provider>
  );
}

export function useSignalR() {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error('useSignalR must be used within a SignalRProvider');
  }
  return context;
} 