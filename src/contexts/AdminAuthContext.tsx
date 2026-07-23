import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  configureAdminAuthInterceptor,
  getAdminAuthToken,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  setAdminAuthToken,
  type AdminUser,
} from "@/lib/auth";

type AdminAuthContextValue = {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  canManageUsers: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    configureAdminAuthInterceptor();

    async function loadUser() {
      if (!getAdminAuthToken()) {
        setIsLoading(false);
        return;
      }

      try {
        setUser(await getCurrentAdmin());
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setAdminAuthToken(null);
        }
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadUser();
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      canManageUsers: user?.role === "super_admin",
      login: async (payload) => {
        const auth = await loginAdmin(payload);
        setUser(auth.user);
      },
      logout: async () => {
        await logoutAdmin();
        setUser(null);
      },
    }),
    [isLoading, user],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  }

  return context;
}
