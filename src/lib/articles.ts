import axios from "axios";

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  published_at: string | null;
  sort_order: number;
  is_active: boolean;
};

type ArticlesResponse = {
  data: Article[];
  message?: string;
};

type ArticleResponse = {
  data: Article;
  message?: string;
};

export type ArticlePayload = Omit<Article, "id" | "sort_order"> & {
  id?: number;
};

type UploadedArticleImage = {
  path: string;
  url: string;
  type: "image";
  mime_type: string;
  original_name: string;
  size: number;
};

export async function getArticles() {
  const response = await axios.get<ArticlesResponse>("/api/articles");

  return response.data.data;
}

export async function getArticle(slug: string) {
  const response = await axios.get<ArticleResponse>(`/api/articles/${slug}`);

  return response.data.data;
}

export async function getAdminArticles() {
  const response = await axios.get<ArticlesResponse>("/api/admin/articles");

  return response.data.data;
}

export async function createArticle(article: ArticlePayload) {
  const response = await axios.post<{
    data: Article;
    message: string;
  }>("/api/admin/articles", article);

  return response.data;
}

export async function updateArticle({
  id,
  article,
}: {
  id: number;
  article: ArticlePayload;
}) {
  const response = await axios.patch<{
    data: Article;
    message: string;
  }>(`/api/admin/articles/${id}`, article);

  return response.data;
}

export async function deleteArticle(id: number) {
  const response = await axios.delete<{
    message: string;
  }>(`/api/admin/articles/${id}`);

  return response.data;
}

export async function reorderArticles(ids: number[]) {
  const response = await axios.patch<ArticlesResponse>(
    "/api/admin/articles/reorder",
    { ids },
  );

  return response.data;
}

export async function uploadArticleImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<{
    data: UploadedArticleImage;
    message: string;
  }>("/api/admin/uploads/articles", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
}
