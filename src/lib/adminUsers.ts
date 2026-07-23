import axios from "axios";

import type { AdminRole, AdminUser } from "@/lib/auth";

type AdminUsersResponse = {
  data: AdminUser[];
};

type AdminUserResponse = {
  data: AdminUser;
  message: string;
};

export type AdminUserPayload = {
  name: string;
  email: string;
  password?: string;
  role: AdminRole;
  is_active: boolean;
};

export async function getAdminUsers() {
  const response = await axios.get<AdminUsersResponse>("/api/admin/users");

  return response.data.data;
}

export async function createAdminUser(payload: Required<AdminUserPayload>) {
  const response = await axios.post<AdminUserResponse>("/api/admin/users", payload);

  return response.data;
}

export async function updateAdminUser({
  id,
  payload,
}: {
  id: number;
  payload: AdminUserPayload;
}) {
  const response = await axios.patch<AdminUserResponse>(
    `/api/admin/users/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteAdminUser(id: number) {
  const response = await axios.delete<{ message: string }>(`/api/admin/users/${id}`);

  return response.data;
}
