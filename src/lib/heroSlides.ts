import axios from "axios";

export type HeroSlide = {
  id: number;
  eyebrow: string | null;
  title: string;
  title_size: number | null;
  subtitle: string | null;
  cta_label: string | null;
  cta_url: string | null;
  background_type: "video" | "image";
  background_url: string | null;
  sort_order: number;
  is_active: boolean;
};

type HeroSlidesResponse = {
  data: HeroSlide[];
  message?: string;
};

export type HeroSlidePayload = Omit<HeroSlide, "id" | "sort_order"> & {
  id?: number;
};

type UploadedHeroMedia = {
  path: string;
  url: string;
  type: "video" | "image";
  mime_type: string;
  original_name: string;
  size: number;
};

export const defaultHeroSlide: HeroSlide = {
  id: 0,
  eyebrow: null,
  title: "Put padel at the center of every game",
  title_size: 96,
  subtitle:
    "Connect players, clubs, rankings, and matchday experiences in one growing padel ecosystem.",
  cta_label: "Book a demo",
  cta_url: "/administrator/dashboard",
  background_type: "video",
  background_url: null,
  sort_order: 0,
  is_active: true,
};

export async function getHeroSlides() {
  const response = await axios.get<HeroSlidesResponse>("/api/hero-slides");

  return response.data.data;
}

export async function getAdminHeroSlides() {
  const response = await axios.get<HeroSlidesResponse>("/api/admin/hero-slides");

  return response.data.data;
}

export async function saveHeroSlides(slides: HeroSlidePayload[]) {
  const response = await axios.put<HeroSlidesResponse>("/api/admin/hero-slides", {
    slides,
  });

  return response.data;
}

export async function createHeroSlide(slide: HeroSlidePayload) {
  const response = await axios.post<{
    data: HeroSlide;
    message: string;
  }>("/api/admin/hero-slides", slide);

  return response.data;
}

export async function updateHeroSlide({
  id,
  slide,
}: {
  id: number;
  slide: HeroSlidePayload;
}) {
  const response = await axios.patch<{
    data: HeroSlide;
    message: string;
  }>(`/api/admin/hero-slides/${id}`, slide);

  return response.data;
}

export async function deleteHeroSlide(id: number) {
  const response = await axios.delete<{
    message: string;
  }>(`/api/admin/hero-slides/${id}`);

  return response.data;
}

export async function reorderHeroSlides(ids: number[]) {
  const response = await axios.patch<HeroSlidesResponse>(
    "/api/admin/hero-slides/reorder",
    { ids },
  );

  return response.data;
}

export async function uploadHeroMedia(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post<{
      data: UploadedHeroMedia;
      message: string;
    }>("/api/admin/uploads/hero", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 413) {
        throw new Error(
          "File terlalu besar untuk server saat ini. Restart backend dengan upload limit 80MB.",
        );
      }

      const responseData = error.response?.data as
        | {
            message?: string;
            errors?: Record<string, string[]>;
          }
        | undefined;
      const firstValidationError = responseData?.errors
        ? Object.values(responseData.errors).flat()[0]
        : undefined;
      const validationMessage = responseData?.message || firstValidationError;

      if (validationMessage) {
        throw new Error(String(validationMessage));
      }
    }

    throw new Error("Failed to upload media.");
  }
}
