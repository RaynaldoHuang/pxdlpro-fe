import axios from "axios";

export type GalleryImageOrientation = "landscape" | "portrait" | "square";

export type GalleryImage = {
  id: number;
  gallery_folder_id: number;
  title: string | null;
  image_url: string;
  orientation: GalleryImageOrientation;
  sort_order: number;
  is_active: boolean;
};

export type GalleryFolder = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  images_count?: number;
  images?: GalleryImage[];
  sort_order: number;
  is_active: boolean;
};

type GalleryFoldersResponse = {
  data: GalleryFolder[];
  message?: string;
};

type GalleryFolderResponse = {
  data: GalleryFolder;
  message?: string;
};

type GalleryImageResponse = {
  data: GalleryImage;
  message?: string;
};

type GalleryImagesResponse = {
  data: GalleryImage[];
  message?: string;
};

export type GalleryFolderPayload = Omit<
  GalleryFolder,
  "id" | "images" | "images_count" | "sort_order"
> & {
  id?: number;
};

export type GalleryImagePayload = Omit<GalleryImage, "id" | "gallery_folder_id" | "sort_order">;

type UploadedGalleryImage = {
  path: string;
  url: string;
  type: "image";
  mime_type: string;
  original_name: string;
  size: number;
};

export async function getGalleryFolders() {
  const response = await axios.get<GalleryFoldersResponse>("/api/gallery-folders");

  return response.data.data;
}

export async function getGalleryFolder(slug: string) {
  const response = await axios.get<GalleryFolderResponse>(
    `/api/gallery-folders/${slug}`,
  );

  return response.data.data;
}

export async function getAdminGalleryFolders() {
  const response = await axios.get<GalleryFoldersResponse>(
    "/api/admin/gallery-folders",
  );

  return response.data.data;
}

export async function createGalleryFolder(folder: GalleryFolderPayload) {
  const response = await axios.post<GalleryFolderResponse>(
    "/api/admin/gallery-folders",
    folder,
  );

  return response.data;
}

export async function updateGalleryFolder({
  id,
  folder,
}: {
  id: number;
  folder: GalleryFolderPayload;
}) {
  const response = await axios.patch<GalleryFolderResponse>(
    `/api/admin/gallery-folders/${id}`,
    folder,
  );

  return response.data;
}

export async function deleteGalleryFolder(id: number) {
  const response = await axios.delete<{ message: string }>(
    `/api/admin/gallery-folders/${id}`,
  );

  return response.data;
}

export async function reorderGalleryFolders(ids: number[]) {
  const response = await axios.patch<GalleryFoldersResponse>(
    "/api/admin/gallery-folders/reorder",
    { ids },
  );

  return response.data;
}

export async function createGalleryImage({
  folderId,
  image,
}: {
  folderId: number;
  image: GalleryImagePayload;
}) {
  const response = await axios.post<GalleryImageResponse>(
    `/api/admin/gallery-folders/${folderId}/images`,
    image,
  );

  return response.data;
}

export async function updateGalleryImage({
  id,
  image,
}: {
  id: number;
  image: GalleryImagePayload;
}) {
  const response = await axios.patch<GalleryImageResponse>(
    `/api/admin/gallery-images/${id}`,
    image,
  );

  return response.data;
}

export async function deleteGalleryImage(id: number) {
  const response = await axios.delete<{ message: string }>(
    `/api/admin/gallery-images/${id}`,
  );

  return response.data;
}

export async function reorderGalleryImages({
  folderId,
  ids,
}: {
  folderId: number;
  ids: number[];
}) {
  const response = await axios.patch<GalleryImagesResponse>(
    `/api/admin/gallery-folders/${folderId}/images/reorder`,
    { ids },
  );

  return response.data;
}

export async function uploadGalleryImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<{
    data: UploadedGalleryImage;
    message: string;
  }>("/api/admin/uploads/gallery", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
}
