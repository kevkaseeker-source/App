import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const me = await api.auth.me();
      setUser(me);
      setLoading(false);
    })();
  }, []);

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}