"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User 
} from "firebase/auth";
import { auth } from "@/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async () => {
    console.log("🚀 Login clicked!");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("❌ Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  useEffect(() => {
    console.log("🔍 AuthProvider mounted");

    // 1. Handle redirect FIRST (critical order!)
    getRedirectResult(auth).then((result) => {
      console.log("📱 getRedirectResult:", result);
      if (result?.user) {
        console.log("✅ Redirect login success:", result.user.email);
        setUser(result.user);
      }
    }).catch((error) => {
      console.error("❌ Redirect error:", error);
    });

    // 2. Listen for ALL future auth changes (AFTER redirect handled)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("👤 onAuthStateChanged:", user?.email || "null");
      setUser(user);
      setLoading(false);
    });

    // 3. Initial load complete
    setTimeout(() => setLoading(false), 1000);

    return () => {
      console.log("🧹 AuthProvider cleanup");
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
