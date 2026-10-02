import React, { createContext, useState, useContext } from "react";
import { hasAuthToken } from "../services/sessionService";
import { setSession, clearSession } from "../services/sessionService";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
interface AuthContextType {
  isLoggedIn: boolean;
  loginAndSetToken: (token: string) => void;
  logoutAndClearToken: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(hasAuthToken());

  const navigate = useNavigate();
  const loginAndSetToken = (token: string) => {
    console.log("token :", token);
    setSession(token);
    setIsLoggedIn(true);
  };

  const logoutAndClearToken = () => {
    logout();
    clearSession();
    setIsLoggedIn(false);
    navigate("/logout");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, loginAndSetToken, logoutAndClearToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
