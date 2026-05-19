import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authApi } from "../api/client";

type Role = "admin" | "staff" | "customer";

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: any) => Promise<boolean>;
  isAuthenticated: boolean;
  authError: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function normalizeRole(role: string): Role {
  const value = role?.toLowerCase();
  if (value === "admin" || value === "staff" || value === "customer") return value;
  return "customer";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const saveUser = (data: any, email: string) => {
    const userData: User = {
      id: data.userId || data.id || email,
      email,
      name: data.fullName || data.name || email,
      role: normalizeRole(data.role),
      token: data.token,
    };

    localStorage.setItem("vpp_token", data.token);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setAuthError("");
    try {
      const result = await authApi.login(email, password);
      if (!result?.token) throw new Error("Login response did not include a token.");
      saveUser(result, email);
      return true;
    } catch (error: any) {
      setAuthError(error.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("vpp_token");
  };

const register = async (data: any): Promise<boolean> => {
  setAuthError("");
  try {
    const result = await authApi.registerCustomer({
      fullName: data.name || data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      address: data.address,

      // vehicle mapping
      plateNumber: data.licensePlate || data.plateNumber,
      make: data.make,
      model: data.model,
      year: Number(data.year),
      vehicleNotes: data.vin || data.vehicleNotes || data.notes || "",
    });

    if (result?.token) saveUser(result, data.email);
    return true;
  } catch (error: any) {
    setAuthError(error.message || "Registration failed");
    return false;
  }
};

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
