import axios from "axios";

type UploadErrorResponse = {
  message?: string;
  errors?: {
    file?: string[];
  };
  limits?: Record<string, string>;
};

export function uploadErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError<UploadErrorResponse>(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  const data = error.response?.data;
  const fileError = data?.errors?.file?.[0];
  const serverMessage = data?.message;
  const limits = data?.limits;
  const limitText = limits
    ? ` Server: upload ${limits.upload_max_filesize}, post ${limits.post_max_size}.`
    : "";

  return `${fileError ?? serverMessage ?? fallback}${limitText}`;
}
