import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const initialToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!initialToken);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    authService.setToken(token);
    authService
      .getProfile()
      .then((data) => {
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        authService.clearToken();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user } = await authService.login(email, password);
    localStorage.setItem("token", token);
    authService.setToken(token);
    setUser(user);
    return user;
  };

  const signup = async (fullName, email, password, bio) => {
    const { token, user } = await authService.signup(
      fullName,
      email,
      password,
      bio,
    );
    localStorage.setItem("token", token);
    authService.setToken(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    authService.clearToken();
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
