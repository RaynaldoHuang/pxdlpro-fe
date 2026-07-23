import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Bold,
  Edit3,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Plus,
  Quote,
  Trash2,
  Upload,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { toast } from "sonner";

import { ContentWrapper } from "@/components/common/ContentWrapper";
import { TablePagination } from "@/components/common/TablePagination";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useClientPagination } from "@/hooks/useClientPagination";
import {
  createArticle,
  deleteArticle,
  getAdminArticles,
  reorderArticles,
  updateArticle,
  uploadArticleImage,
  type Article,
  type ArticlePayload,
} from "@/lib/articles";

type ArticleForm = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  published_at: string;
  is_active: boolean;
};

const emptyForm: ArticleForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
  published_at: "",
  is_active: true,
};

function articleToForm(article?: Article | null): ArticleForm {
  if (!article) {
    return emptyForm;
  }

  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt ?? "",
    content: article.content ?? "",
    image_url: article.image_url ?? "",
    published_at: article.published_at
      ? article.published_at.slice(0, 16)
      : "",
    is_active: article.is_active,
  };
}

function formToPayload(form: ArticleForm): ArticlePayload {
  return {
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt || null,
    content: form.content || null,
    image_url: form.image_url || null,
    published_at: form.published_at || null,
    is_active: form.is_active,
  };
}

function formatDate(value: string | null) {
  if (!value) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

type ArticleContentEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

function ArticleContentEditor({ value, onChange }: ArticleContentEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  function escapeHtml(text: string) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function contentToHtml(content: string) {
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return content;
    }

    return escapeHtml(content)
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  useEffect(() => {
    const editor = editorRef.current;

    if (!editor || document.activeElement === editor) {
      return;
    }

    editor.innerHTML = contentToHtml(value);
  }, [value]);

  function syncContent() {
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function runCommand(command: string, commandValue?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    syncContent();
  }

  function createLink() {
    const url = window.prompt("Enter link URL");

    if (!url) {
      return;
    }

    runCommand("createLink", url);
  }

  const tools = [
    {
      label: "Heading",
      icon: Heading2,
      action: () => runCommand("formatBlock", "h2"),
    },
    {
      label: "Bold",
      icon: Bold,
      action: () => runCommand("bold"),
    },
    {
      label: "Italic",
      icon: Italic,
      action: () => runCommand("italic"),
    },
    {
      label: "Bullet list",
      icon: List,
      action: () => runCommand("insertUnorderedList"),
    },
    {
      label: "Numbered list",
      icon: ListOrdered,
      action: () => runCommand("insertOrderedList"),
    },
    {
      label: "Quote",
      icon: Quote,
      action: () => runCommand("formatBlock", "blockquote"),
    },
    {
      label: "Link",
      icon: Link2,
      action: createLink,
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg border bg-background">
      <div className="flex flex-wrap gap-1 border-b bg-muted/35 p-2">
        {tools.map((tool) => (
          <Button
            key={tool.label}
            type="button"
            variant="ghost"
            size="icon-sm"
            title={tool.label}
            onClick={tool.action}
          >
            <tool.icon className="size-4" />
            <span className="sr-only">{tool.label}</span>
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        id="article-content"
        contentEditable
        suppressContentEditableWarning
        className="max-h-72 min-h-56 w-full overflow-y-auto px-4 py-3 text-base leading-7 outline-none [&_a]:text-[#07503d] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-[#07503d] [&_blockquote]:pl-4 [&_h2]:text-2xl [&_h2]:font-normal [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"
        onInput={syncContent}
      />
      <div className="border-t bg-muted/25 px-3 py-2 text-xs text-muted-foreground">
        Changes preview directly here. Supports headings, bold, italic,
        bullets, numbers, quotes, and links.
      </div>
    </div>
  );
}

export function ArticlesPage() {
  const queryClient = useQueryClient();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: getAdminArticles,
  });
  const activeCount = useMemo(
    () => data.filter((article) => article.is_active).length,
    [data],
  );

  async function refreshArticles() {
    await queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    await queryClient.invalidateQueries({ queryKey: ["articles"] });
  }

  const createMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: async () => {
      toast.success("Artikel berhasil ditambahkan.");
      setIsEditorOpen(false);
      await refreshArticles();
    },
    onError: () => toast.error("Gagal menambahkan artikel."),
  });

  const updateMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: async () => {
      toast.success("Artikel berhasil diupdate.");
      setIsEditorOpen(false);
      setEditingArticle(null);
      await refreshArticles();
    },
    onError: () => toast.error("Gagal mengupdate artikel."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: async () => {
      toast.success("Artikel berhasil dihapus.");
      setDeleteTarget(null);
      await refreshArticles();
    },
    onError: () => toast.error("Gagal menghapus artikel."),
  });

  const reorderMutation = useMutation({
    mutationFn: reorderArticles,
    onSuccess: async () => {
      toast.success("Urutan artikel berhasil diupdate.");
      await refreshArticles();
    },
    onError: () => toast.error("Gagal mengupdate urutan artikel."),
  });

  function openAddDialog() {
    setEditingArticle(null);
    setIsEditorOpen(true);
  }

  function openEditDialog(article: Article) {
    setEditingArticle(article);
    setIsEditorOpen(true);
  }

  function moveArticle(articleId: number, direction: -1 | 1) {
    const index = data.findIndex((article) => article.id === articleId);
    const targetIndex = index + direction;

    if (index < 0 || targetIndex < 0 || targetIndex >= data.length) {
      return;
    }

    const next = [...data];
    const [article] = next.splice(index, 1);
    next.splice(targetIndex, 0, article);
    reorderMutation.mutate(next.map((item) => item.id));
  }

  function submitEditor(form: ArticleForm) {
    const payload = formToPayload(form);

    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, article: payload });
      return;
    }

    createMutation.mutate(payload);
  }

  const editorPending = createMutation.isPending || updateMutation.isPending;
  const tablePending = deleteMutation.isPending || reorderMutation.isPending;
  const articlePagination = useClientPagination(data);

  return (
    <ContentWrapper>
      <PageHeader
        title="Articles"
        description="Kelola artikel blog yang tampil di halaman Blog website publik."
        actions={
          <Button
            type="button"
            className="bg-[#07503d] text-white hover:bg-[#064433]"
            onClick={openAddDialog}
          >
            <Plus className="size-4" />
            Add article
          </Button>
        }
      />

      <Card className="gap-0 rounded-lg py-0">
        <CardHeader className="border-b px-4 py-4">
          <div>
            <CardTitle>Blog Articles</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.length} articles, {activeCount} active
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3">
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">No</TableHead>
                <TableHead className="w-24">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Order</TableHead>
                <TableHead className="w-28 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="h-28 text-center">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Loading articles...
                    </span>
                  </TableCell>
                </TableRow>
              )}

              {isError && !isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-28 text-center text-destructive"
                  >
                    Backend artikel belum tersedia.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-28 text-center text-muted-foreground"
                  >
                    Belum ada artikel. Klik Add article untuk menambahkan.
                  </TableCell>
                </TableRow>
              )}

              {articlePagination.paginatedItems.map((article, index) => {
                const articleIndex = articlePagination.startIndex + index;

                return (
                <TableRow key={article.id}>
                  <TableCell>{articleIndex + 1}</TableCell>
                  <TableCell>
                    <div className="flex size-14 items-center justify-center overflow-hidden rounded-md border bg-muted/30">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="size-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="size-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-normal">{article.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {article.slug}
                  </TableCell>
                  <TableCell>{formatDate(article.published_at)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        article.is_active
                          ? "bg-[#07503d] text-white"
                          : undefined
                      }
                      variant={article.is_active ? "default" : "outline"}
                    >
                      {article.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => moveArticle(article.id, -1)}
                        disabled={articleIndex === 0 || tablePending}
                        title="Move up"
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => moveArticle(article.id, 1)}
                        disabled={articleIndex === data.length - 1 || tablePending}
                        title="Move down"
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(article)}
                        title="Edit article"
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(article)}
                        disabled={deleteMutation.isPending}
                        title="Delete article"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            page={articlePagination.page}
            pageCount={articlePagination.pageCount}
            pageSize={articlePagination.pageSize}
            totalItems={articlePagination.totalItems}
            startItem={articlePagination.startItem}
            endItem={articlePagination.endItem}
            onPageChange={articlePagination.setPage}
            onPageSizeChange={articlePagination.setPageSize}
          />
        </CardContent>
      </Card>

      <ArticleDialog
        key={editingArticle?.id ?? "new"}
        open={isEditorOpen}
        article={editingArticle}
        pending={editorPending}
        onOpenChange={setIsEditorOpen}
        onSubmit={submitEditor}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete article?</DialogTitle>
            <DialogDescription>
              Artikel ini akan dihapus dari halaman Blog website publik.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteMutation.isPending || !deleteTarget}
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.id)
              }
            >
              {deleteMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentWrapper>
  );
}

type ArticleDialogProps = {
  open: boolean;
  article: Article | null;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: ArticleForm) => void;
};

function ArticleDialog({
  open,
  article,
  pending,
  onOpenChange,
  onSubmit,
}: ArticleDialogProps) {
  const [form, setForm] = useState<ArticleForm>(() => articleToForm(article));
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      setForm(articleToForm(article));
    }
  }, [open, article]);

  function updateField<Key extends keyof ArticleForm>(
    field: Key,
    value: ArticleForm[Key],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  async function handleImageUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      toast.error("File maksimal 12MB.");
      return;
    }

    setUploadingFileName(file.name);

    try {
      const media = await uploadArticleImage(file);
      setForm((current) => ({
        ...current,
        image_url: media.url,
      }));
      toast.success("Image berhasil diupload.");
    } catch {
      toast.error("Gagal upload image.");
    } finally {
      setUploadingFileName(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden p-0 sm:max-w-3xl">
        <form className="flex max-h-[calc(100vh-2rem)] min-h-0 flex-col" onSubmit={handleSubmit}>
          <DialogHeader className="shrink-0 px-4 pt-4 sm:px-6 sm:pt-6">
            <DialogTitle>{article ? "Edit article" : "Add article"}</DialogTitle>
            <DialogDescription>
              Artikel ini akan tampil di halaman Blog website publik.
            </DialogDescription>
          </DialogHeader>

          <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto px-4 py-4 sm:px-6">
            <div className="grid gap-4 sm:grid-cols-[140px_1fr] sm:items-start">
              <div className="flex aspect-[1.25] items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt={form.title || "Article preview"}
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-8 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="article-image-upload">Upload image</Label>
                <div className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 truncate text-xs text-muted-foreground">
                    {uploadingFileName
                      ? `Uploading ${uploadingFileName}...`
                      : "JPG, PNG, WEBP, GIF. Max 12MB."}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="relative overflow-hidden"
                    disabled={Boolean(uploadingFileName)}
                  >
                    {uploadingFileName ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    Choose file
                    <input
                      id="article-image-upload"
                      type="file"
                      className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      disabled={Boolean(uploadingFileName)}
                      onChange={(event) => {
                        void handleImageUpload(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="article-title">Title</Label>
                <Input
                  id="article-title"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="Building a stronger padel community"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="article-slug">Slug</Label>
                <Input
                  id="article-slug"
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  placeholder="building-a-stronger-padel-community"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="article-excerpt">Excerpt</Label>
              <Textarea
                id="article-excerpt"
                value={form.excerpt}
                onChange={(event) => updateField("excerpt", event.target.value)}
                placeholder="Short summary for the blog list."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="article-content">Content</Label>
              <ArticleContentEditor
                value={form.content}
                onChange={(content) => updateField("content", content)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="article-image-url">Image URL</Label>
                <Input
                  id="article-image-url"
                  value={form.image_url}
                  onChange={(event) =>
                    updateField("image_url", event.target.value)
                  }
                  placeholder="/storage/articles/article.webp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="article-published-at">Published at</Label>
                <Input
                  id="article-published-at"
                  type="datetime-local"
                  value={form.published_at}
                  onChange={(event) =>
                    updateField("published_at", event.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="article-active"
                type="checkbox"
                className="size-4 rounded border-input"
                checked={form.is_active}
                onChange={(event) =>
                  updateField("is_active", event.target.checked)
                }
              />
              <Label htmlFor="article-active">Active article</Label>
            </div>
          </div>

          <DialogFooter className="mx-0 mb-0 shrink-0 rounded-b-xl px-4 py-4 sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#07503d] text-white hover:bg-[#064433]"
              disabled={pending}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {article ? "Update article" : "Create article"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
