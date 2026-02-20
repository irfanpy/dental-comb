import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authMode, setAuthMode] = useState("login");
  const [auth, setAuth] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const isAuthed = Boolean(token);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setAuth({ email: "", password: "" });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const clearError = () => setError("");

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthed,
        authMode,
        setAuthMode,
        auth,
        setAuth,
        error,
        setError,
        clearError,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};