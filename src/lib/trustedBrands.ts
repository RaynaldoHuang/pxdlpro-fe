import axios from "axios";

export type TrustedBrand = {
  id: number;
  name: string;
  logo_url: string;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type TrustedBrandsResponse = {
  data: TrustedBrand[];
  message?: string;
};

export type TrustedBrandPayload = Omit<TrustedBrand, "id" | "sort_order"> & {
  id?: number;
};

type UploadedTrustedBrandLogo = {
  path: string;
  url: string;
  type: "image";
  mime_type: string;
  original_name: string;
  size: number;
};

export async function getTrustedBrands() {
  const response = await axios.get<TrustedBrandsResponse>("/api/trusted-brands");

  return response.data.data;
}

export async function getAdminTrustedBrands() {
  const response = await axios.get<TrustedBrandsResponse>(
    "/api/admin/trusted-brands",
  );

  return response.data.data;
}

export async function createTrustedBrand(brand: TrustedBrandPayload) {
  const response = await axios.post<{
    data: TrustedBrand;
    message: string;
  }>("/api/admin/trusted-brands", brand);

  return response.data;
}

export async function updateTrustedBrand({
  id,
  brand,
}: {
  id: number;
  brand: TrustedBrandPayload;
}) {
  const response = await axios.patch<{
    data: TrustedBrand;
    message: string;
  }>(`/api/admin/trusted-brands/${id}`, brand);

  return response.data;
}

export async function deleteTrustedBrand(id: number) {
  const response = await axios.delete<{
    message: string;
  }>(`/api/admin/trusted-brands/${id}`);

  return response.data;
}

export async function reorderTrustedBrands(ids: number[]) {
  const response = await axios.patch<TrustedBrandsResponse>(
    "/api/admin/trusted-brands/reorder",
    { ids },
  );

  return response.data;
}

export async function uploadTrustedBrandLogo(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<{
    data: UploadedTrustedBrandLogo;
    message: string;
  }>("/api/admin/uploads/trusted-brands", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
}
