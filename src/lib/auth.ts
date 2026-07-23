import axios from "axios";

export type AdminRole = "super_admin" | "admin";

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

type AuthResponse = {
  data: {
    token: string;
    user: AdminUser;
  };
  message: string;
};

type CurrentUserResponse = {
  data: AdminUser;
};

const adminTokenStorageKey = "pxdl_admin_token";
let interceptorConfigured = false;

export function getAdminAuthToken() {
  return window.localStorage.getItem(adminTokenStorageKey);
}

export function setAdminAuthToken(token: string | null) {
  if (token) {
    window.localStorage.setItem(adminTokenStorageKey, token);
    return;
  }

  window.localStorage.removeItem(adminTokenStorageKey);
}

export function configureAdminAuthInterceptor() {
  if (interceptorConfigured) {
    return;
  }

  axios.interceptors.request.use((config) => {
    const url = config.url ?? "";
    const token = getAdminAuthToken();

    if (token && url.includes("/api/admin")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  interceptorConfigured = true;
}

export async function loginAdmin(payload: { email: string; password: string }) {
  const response = await axios.post<AuthResponse>("/api/admin/auth/login", payload);

  setAdminAuthToken(response.data.data.token);

  return response.data.data;
}

export async function getCurrentAdmin() {
  const response = await axios.get<CurrentUserResponse>("/api/admin/auth/me");

  return response.data.data;
}

export async function logoutAdmin() {
  try {
    await axios.post<{ message: string }>("/api/admin/auth/logout");
  } finally {
    setAdminAuthToken(null);
  }
}
