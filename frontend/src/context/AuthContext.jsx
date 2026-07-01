import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined=loading, null=guest, obj=admin
  const [checked, setChecked] = useState(false);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("eo_admin_token");
    if (!token) {
      setUser(null);
      setChecked(true);
      return;
    }
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
    } catch {
      localStorage.removeItem("eo_admin_token");
      setUser(null);
    } finally {
      setChecked(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("eo_admin_token", data.access_token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("eo_admin_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, checked, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
