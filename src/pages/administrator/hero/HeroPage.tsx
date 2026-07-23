import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  Eye,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { AdminUploadField } from "@/components/common/AdminUploadField";
import { ContentWrapper } from "@/components/common/ContentWrapper";
import { TablePagination } from "@/components/common/TablePagination";
import { PageHeader } from "@/components/layout/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  createHeroSlide,
  deleteHeroSlide,
  getAdminHeroSlides,
  reorderHeroSlides,
  updateHeroSlide,
  uploadHeroMedia,
  type HeroSlide,
  type HeroSlidePayload,
} from "@/lib/heroSlides";
import { uploadErrorMessage } from "@/lib/uploadErrors";

type HeroSlideForm = {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_url: string;
  background_type: "video" | "image";
  background_url: string;
  is_active: boolean;
};

const emptyForm: HeroSlideForm = {
  eyebrow: "",
  title: "",
  subtitle: "",
  cta_label: "Reclub",
  cta_url: "/administrator/dashboard",
  background_type: "video",
  background_url: "",
  is_active: true,
};

function slideToForm(slide?: HeroSlide): HeroSlideForm {
  if (!slide) {
    return emptyForm;
  }

  return {
    eyebrow: slide.eyebrow ?? "",
    title: slide.title,
    subtitle: slide.subtitle ?? "",
    cta_label: slide.cta_label ?? "",
    cta_url: slide.cta_url ?? "",
    background_type: slide.background_type,
    background_url: slide.background_url ?? "",
    is_active: slide.is_active,
  };
}

function formToPayload(form: HeroSlideForm): HeroSlidePayload {
  return {
    eyebrow: form.eyebrow || null,
    title: form.title,
    subtitle: form.subtitle || null,
    cta_label: form.cta_label || null,
    cta_url: form.cta_url || null,
    background_type: form.background_type,
    background_url: form.background_url || null,
    is_active: form.is_active,
  };
}

export function HeroPage() {
  const queryClient = useQueryClient();
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [detailSlide, setDetailSlide] = useState<HeroSlide | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<HeroSlide | null>(null);
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["admin-hero-slides"],
    queryFn: getAdminHeroSlides,
  });

  const activeCount = useMemo(
    () => data.filter((slide) => slide.is_active).length,
    [data],
  );

  async function refreshHeroData() {
    await queryClient.invalidateQueries({ queryKey: ["admin-hero-slides"] });
    await queryClient.invalidateQueries({ queryKey: ["hero-slides"] });
  }

  const createMutation = useMutation({
    mutationFn: createHeroSlide,
    onSuccess: async () => {
      toast.success("Hero slide berhasil ditambahkan.");
      setIsEditorOpen(false);
      await refreshHeroData();
    },
    onError: () => {
      toast.error("Gagal menambahkan hero slide.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateHeroSlide,
    onSuccess: async () => {
      toast.success("Hero slide berhasil diupdate.");
      setIsEditorOpen(false);
      setEditingSlide(null);
      await refreshHeroData();
    },
    onError: () => {
      toast.error("Gagal mengupdate hero slide.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteHeroSlide,
    onSuccess: async () => {
      toast.success("Hero slide berhasil dihapus.");
      setDeleteTarget(null);
      await refreshHeroData();
    },
    onError: () => {
      toast.error("Gagal menghapus hero slide.");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderHeroSlides,
    onSuccess: async () => {
      toast.success("Urutan hero slide berhasil diupdate.");
      await refreshHeroData();
    },
    onError: () => {
      toast.error("Gagal mengupdate urutan hero slide.");
    },
  });

  function openAddDialog() {
    setEditingSlide(null);
    setIsEditorOpen(true);
  }

  function openEditDialog(slide: HeroSlide) {
    setEditingSlide(slide);
    setIsEditorOpen(true);
  }

  function moveSlide(slideId: number, direction: -1 | 1) {
    const index = data.findIndex((slide) => slide.id === slideId);
    const targetIndex = index + direction;

    if (index < 0 || targetIndex < 0 || targetIndex >= data.length) {
      return;
    }

    const next = [...data];
    const [slide] = next.splice(index, 1);
    next.splice(targetIndex, 0, slide);
    reorderMutation.mutate(next.map((item) => item.id));
  }

  function submitEditor(form: HeroSlideForm) {
    const payload = formToPayload(form);

    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide.id, slide: payload });
      return;
    }

    createMutation.mutate(payload);
  }

  const editorPending = createMutation.isPending || updateMutation.isPending;
  const tablePending = deleteMutation.isPending || reorderMutation.isPending;
  const slidePagination = useClientPagination(data);

  return (
    <ContentWrapper>
      <PageHeader
        title="Hero"
        description="Kelola konten carousel hero website publik."
        actions={
          <Button
            type="button"
            className="bg-[#07503d] text-white hover:bg-[#064433]"
            onClick={openAddDialog}
          >
            <Plus className="size-4" />
            Add slide
          </Button>
        }
      />

      <Card className="gap-0 rounded-lg py-0">
        <CardHeader className="border-b px-4 py-4">
          <div>
            <CardTitle>Hero Carousel</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.length} slides, {activeCount} active
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3">
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>CTA</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Order</TableHead>
                <TableHead className="w-36 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Loading hero slides...
                    </span>
                  </TableCell>
                </TableRow>
              )}

              {isError && !isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-28 text-center text-destructive"
                  >
                    Backend hero data belum tersedia.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-28 text-center text-muted-foreground"
                  >
                    Belum ada hero slide. Klik Add slide untuk membuat konten.
                  </TableCell>
                </TableRow>
              )}

              {slidePagination.paginatedItems.map((slide, index) => {
                const slideIndex = slidePagination.startIndex + index;

                return (
                <TableRow key={slide.id}>
                  <TableCell>{slideIndex + 1}</TableCell>
                  <TableCell className="max-w-sm whitespace-normal">
                    <div className="space-y-1">
                      {slide.eyebrow && (
                        <p className="text-xs uppercase tracking-normal text-muted-foreground">
                          {slide.eyebrow}
                        </p>
                      )}
                      <p className="font-normal text-foreground">
                        {slide.title}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {slide.cta_label || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{slide.background_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        slide.is_active
                          ? "bg-[#07503d] text-white"
                          : undefined
                      }
                      variant={slide.is_active ? "default" : "outline"}
                    >
                      {slide.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => moveSlide(slide.id, -1)}
                        disabled={slideIndex === 0 || tablePending}
                        title="Move up"
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => moveSlide(slide.id, 1)}
                        disabled={slideIndex === data.length - 1 || tablePending}
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
                        onClick={() => setDetailSlide(slide)}
                        title="View detail"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(slide)}
                        title="Edit slide"
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(slide)}
                        disabled={deleteMutation.isPending}
                        title="Delete slide"
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
            page={slidePagination.page}
            pageCount={slidePagination.pageCount}
            pageSize={slidePagination.pageSize}
            totalItems={slidePagination.totalItems}
            startItem={slidePagination.startItem}
            endItem={slidePagination.endItem}
            onPageChange={slidePagination.setPage}
            onPageSizeChange={slidePagination.setPageSize}
          />
        </CardContent>
      </Card>

      <HeroSlideDialog
        key={editingSlide?.id ?? "new"}
        open={isEditorOpen}
        slide={editingSlide}
        pending={editorPending}
        onOpenChange={setIsEditorOpen}
        onSubmit={submitEditor}
      />

      <HeroSlideDetailDialog
        slide={detailSlide}
        onOpenChange={(open) => !open && setDetailSlide(null)}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete hero slide?</DialogTitle>
            <DialogDescription>
              Slide ini akan dihapus dari carousel website publik.
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
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
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

type HeroSlideDetailDialogProps = {
  slide: HeroSlide | null;
  onOpenChange: (open: boolean) => void;
};

function HeroSlideDetailDialog({
  slide,
  onOpenChange,
}: HeroSlideDetailDialogProps) {
  return (
    <Dialog open={Boolean(slide)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hero slide detail</DialogTitle>
          <DialogDescription>
            Ringkasan lengkap konten yang tampil di carousel hero.
          </DialogDescription>
        </DialogHeader>

        {slide && (
          <div className="grid gap-3 text-sm">
            <DetailRow label="Title" value={slide.title} />
            <DetailRow label="Eyebrow" value={slide.eyebrow || "-"} />
            <DetailRow label="Subtitle" value={slide.subtitle || "-"} />
            <DetailRow label="CTA label" value={slide.cta_label || "-"} />
            <DetailRow label="CTA URL" value={slide.cta_url || "-"} />
            <DetailRow label="Background type" value={slide.background_type} />
            <DetailRow
              label="Background URL"
              value={slide.background_url || "Default video"}
            />
            <DetailRow
              label="Status"
              value={slide.is_active ? "Active" : "Inactive"}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-lg border bg-muted/20 p-3 sm:grid-cols-[160px_1fr] sm:gap-4">
      <div className="font-normal text-muted-foreground">{label}</div>
      <div className="break-words text-foreground">{value}</div>
    </div>
  );
}

type HeroSlideDialogProps = {
  open: boolean;
  slide: HeroSlide | null;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: HeroSlideForm) => void;
};

function HeroSlideDialog({
  open,
  slide,
  pending,
  onOpenChange,
  onSubmit,
}: HeroSlideDialogProps) {
  const [form, setForm] = useState<HeroSlideForm>(() =>
    slideToForm(slide ?? undefined),
  );
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      setForm(slideToForm(slide ?? undefined));
    }
  }, [open, slide]);

  function updateField<Key extends keyof HeroSlideForm>(
    field: Key,
    value: HeroSlideForm[Key],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  async function handleFileUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    if (file.size > 80 * 1024 * 1024) {
      toast.error("File maksimal 80MB.");
      return;
    }

    setUploadingFileName(file.name);

    try {
      const media = await uploadHeroMedia(file);
      setForm((current) => ({
        ...current,
        background_type: media.type,
        background_url: media.url,
      }));
      toast.success("Media berhasil diupload.");
    } catch (error) {
      toast.error(uploadErrorMessage(error, "Gagal upload media."));
    } finally {
      setUploadingFileName(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-3xl">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{slide ? "Edit slide" : "Add slide"}</DialogTitle>
            <DialogDescription>
              Konten ini akan tampil di hero carousel website publik.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="hero-eyebrow">Eyebrow</Label>
              <Input
                id="hero-eyebrow"
                value={form.eyebrow}
                onChange={(event) =>
                  updateField("eyebrow", event.target.value)
                }
                placeholder="Optional short label"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                id="hero-active"
                type="checkbox"
                className="size-4 rounded border-input"
                checked={form.is_active}
                onChange={(event) =>
                  updateField("is_active", event.target.checked)
                }
              />
              <Label htmlFor="hero-active">Active slide</Label>
            </div>

            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                required
              />
            </div>

            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                value={form.subtitle}
                onChange={(event) =>
                  updateField("subtitle", event.target.value)
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-cta-label">CTA label</Label>
              <Input
                id="hero-cta-label"
                value={form.cta_label}
                onChange={(event) =>
                  updateField("cta_label", event.target.value)
                }
                placeholder="Book a demo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-cta-url">CTA URL</Label>
              <Input
                id="hero-cta-url"
                value={form.cta_url}
                onChange={(event) => updateField("cta_url", event.target.value)}
                placeholder="/administrator/dashboard"
              />
            </div>

            <div className="lg:col-span-2">
              <AdminUploadField
                id="hero-media-upload"
                label="Upload local media"
                helperText="JPG, PNG, WEBP, GIF, MP4, WEBM, MOV, M4V. Max 80MB."
                uploadingFileName={uploadingFileName}
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,video/x-m4v"
                previewUrl={
                  form.background_type === "image"
                    ? form.background_url
                    : undefined
                }
                previewAlt={form.title || "Hero media preview"}
                onFileChange={(file) => void handleFileUpload(file)}
              />
            </div>

            <div className="space-y-2">
              <Label>Background type</Label>
              <Select
                value={form.background_type}
                onValueChange={(value) =>
                  updateField("background_type", value as "video" | "image")
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero-background">Background URL</Label>
              <Input
                id="hero-background"
                value={form.background_url}
                onChange={(event) =>
                  updateField("background_url", event.target.value)
                }
                placeholder="Leave empty to use default video"
              />
            </div>
          </div>

          <DialogFooter>
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
              {slide ? "Update slide" : "Create slide"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
