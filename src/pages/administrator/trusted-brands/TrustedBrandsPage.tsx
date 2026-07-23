import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  ExternalLink,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useClientPagination } from "@/hooks/useClientPagination";
import {
  createTrustedBrand,
  deleteTrustedBrand,
  getAdminTrustedBrands,
  reorderTrustedBrands,
  updateTrustedBrand,
  uploadTrustedBrandLogo,
  type TrustedBrand,
  type TrustedBrandPayload,
} from "@/lib/trustedBrands";

type TrustedBrandForm = {
  name: string;
  logo_url: string;
  website_url: string;
  is_active: boolean;
};

const emptyForm: TrustedBrandForm = {
  name: "",
  logo_url: "",
  website_url: "",
  is_active: true,
};

function brandToForm(brand?: TrustedBrand): TrustedBrandForm {
  if (!brand) {
    return emptyForm;
  }

  return {
    name: brand.name,
    logo_url: brand.logo_url,
    website_url: brand.website_url ?? "",
    is_active: brand.is_active,
  };
}

function formToPayload(form: TrustedBrandForm): TrustedBrandPayload {
  return {
    name: form.name,
    logo_url: form.logo_url,
    website_url: form.website_url || null,
    is_active: form.is_active,
  };
}

export function TrustedBrandsPage() {
  const queryClient = useQueryClient();
  const [editingBrand, setEditingBrand] = useState<TrustedBrand | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TrustedBrand | null>(null);
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["admin-trusted-brands"],
    queryFn: getAdminTrustedBrands,
  });

  const activeCount = useMemo(
    () => data.filter((brand) => brand.is_active).length,
    [data],
  );

  async function refreshTrustedBrands() {
    await queryClient.invalidateQueries({ queryKey: ["admin-trusted-brands"] });
    await queryClient.invalidateQueries({ queryKey: ["trusted-brands"] });
  }

  const createMutation = useMutation({
    mutationFn: createTrustedBrand,
    onSuccess: async () => {
      toast.success("Sponsor berhasil ditambahkan.");
      setIsEditorOpen(false);
      await refreshTrustedBrands();
    },
    onError: () => {
      toast.error("Gagal menambahkan sponsor.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTrustedBrand,
    onSuccess: async () => {
      toast.success("Sponsor berhasil diupdate.");
      setIsEditorOpen(false);
      setEditingBrand(null);
      await refreshTrustedBrands();
    },
    onError: () => {
      toast.error("Gagal mengupdate sponsor.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTrustedBrand,
    onSuccess: async () => {
      toast.success("Sponsor berhasil dihapus.");
      setDeleteTarget(null);
      await refreshTrustedBrands();
    },
    onError: () => {
      toast.error("Gagal menghapus sponsor.");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderTrustedBrands,
    onSuccess: async () => {
      toast.success("Urutan sponsor berhasil diupdate.");
      await refreshTrustedBrands();
    },
    onError: () => {
      toast.error("Gagal mengupdate urutan sponsor.");
    },
  });

  function openAddDialog() {
    setEditingBrand(null);
    setIsEditorOpen(true);
  }

  function openEditDialog(brand: TrustedBrand) {
    setEditingBrand(brand);
    setIsEditorOpen(true);
  }

  function moveBrand(brandId: number, direction: -1 | 1) {
    const index = data.findIndex((brand) => brand.id === brandId);
    const targetIndex = index + direction;

    if (index < 0 || targetIndex < 0 || targetIndex >= data.length) {
      return;
    }

    const next = [...data];
    const [brand] = next.splice(index, 1);
    next.splice(targetIndex, 0, brand);
    reorderMutation.mutate(next.map((item) => item.id));
  }

  function submitEditor(form: TrustedBrandForm) {
    const payload = formToPayload(form);

    if (editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, brand: payload });
      return;
    }

    createMutation.mutate(payload);
  }

  const editorPending = createMutation.isPending || updateMutation.isPending;
  const tablePending = deleteMutation.isPending || reorderMutation.isPending;
  const brandPagination = useClientPagination(data);

  return (
    <ContentWrapper>
      <PageHeader
        title="Sponsorship"
        description="Kelola logo sponsor yang tampil di section Trusted By website publik."
        actions={
          <Button
            type="button"
            className="bg-[#07503d] text-white hover:bg-[#064433]"
            onClick={openAddDialog}
          >
            <Plus className="size-4" />
            Add sponsor
          </Button>
        }
      />

      <Card className="gap-0 rounded-lg py-0">
        <CardHeader className="border-b px-4 py-4">
          <div>
            <CardTitle>Sponsor Logos</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.length} sponsors, {activeCount} active
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3">
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">No</TableHead>
                <TableHead className="w-28">Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Order</TableHead>
                <TableHead className="w-28 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-28 text-center">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Loading sponsors...
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
                    Backend sponsorship data belum tersedia.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-28 text-center text-muted-foreground"
                  >
                    Belum ada sponsor. Klik Add sponsor untuk menambahkan logo.
                  </TableCell>
                </TableRow>
              )}

              {brandPagination.paginatedItems.map((brand, index) => {
                const brandIndex = brandPagination.startIndex + index;

                return (
                <TableRow key={brand.id}>
                  <TableCell>{brandIndex + 1}</TableCell>
                  <TableCell>
                    <div className="flex size-14 items-center justify-center rounded-md border bg-muted/30 p-2">
                      {brand.logo_url ? (
                        <img
                          src={brand.logo_url}
                          alt={brand.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="size-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-normal">{brand.name}</TableCell>
                  <TableCell>
                    {brand.website_url ? (
                      <a
                        href={brand.website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#07503d] hover:underline"
                      >
                        Open
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        brand.is_active
                          ? "bg-[#07503d] text-white"
                          : undefined
                      }
                      variant={brand.is_active ? "default" : "outline"}
                    >
                      {brand.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => moveBrand(brand.id, -1)}
                        disabled={brandIndex === 0 || tablePending}
                        title="Move up"
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => moveBrand(brand.id, 1)}
                        disabled={brandIndex === data.length - 1 || tablePending}
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
                        onClick={() => openEditDialog(brand)}
                        title="Edit sponsor"
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(brand)}
                        disabled={deleteMutation.isPending}
                        title="Delete sponsor"
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
            page={brandPagination.page}
            pageCount={brandPagination.pageCount}
            pageSize={brandPagination.pageSize}
            totalItems={brandPagination.totalItems}
            startItem={brandPagination.startItem}
            endItem={brandPagination.endItem}
            onPageChange={brandPagination.setPage}
            onPageSizeChange={brandPagination.setPageSize}
          />
        </CardContent>
      </Card>

      <TrustedBrandDialog
        key={editingBrand?.id ?? "new"}
        open={isEditorOpen}
        brand={editingBrand}
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
            <DialogTitle>Delete sponsor?</DialogTitle>
            <DialogDescription>
              Logo sponsor ini akan dihapus dari section Trusted By website publik.
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

type TrustedBrandDialogProps = {
  open: boolean;
  brand: TrustedBrand | null;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: TrustedBrandForm) => void;
};

function TrustedBrandDialog({
  open,
  brand,
  pending,
  onOpenChange,
  onSubmit,
}: TrustedBrandDialogProps) {
  const [form, setForm] = useState<TrustedBrandForm>(() =>
    brandToForm(brand ?? undefined),
  );
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      setForm(brandToForm(brand ?? undefined));
    }
  }, [open, brand]);

  function updateField<Key extends keyof TrustedBrandForm>(
    field: Key,
    value: TrustedBrandForm[Key],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  async function handleLogoUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      toast.error("File maksimal 8MB.");
      return;
    }

    setUploadingFileName(file.name);

    try {
      const media = await uploadTrustedBrandLogo(file);
      setForm((current) => ({
        ...current,
        logo_url: media.url,
      }));
      toast.success("Logo berhasil diupload.");
    } catch {
      toast.error("Gagal upload logo.");
    } finally {
      setUploadingFileName(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{brand ? "Edit sponsor" : "Add sponsor"}</DialogTitle>
            <DialogDescription>
              Logo ini akan tampil di section Trusted By website publik.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-[112px_1fr] sm:items-start">
              <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted/30 p-4">
                {form.logo_url ? (
                  <img
                    src={form.logo_url}
                    alt={form.name || "Sponsor logo preview"}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <ImageIcon className="size-8 text-muted-foreground" />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand-logo-upload">Upload logo</Label>
                <div className="flex flex-col gap-2 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 truncate text-xs text-muted-foreground">
                    {uploadingFileName
                      ? `Uploading ${uploadingFileName}...`
                      : "JPG, PNG, WEBP, GIF, SVG. Max 8MB."}
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
                      id="brand-logo-upload"
                      type="file"
                      className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      disabled={Boolean(uploadingFileName)}
                      onChange={(event) => {
                        void handleLogoUpload(event.target.files?.[0]);
                        event.target.value = "";
                      }}
                    />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-name">Sponsor name</Label>
              <Input
                id="brand-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="PXDL Partner"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-logo-url">Logo URL</Label>
              <Input
                id="brand-logo-url"
                value={form.logo_url}
                onChange={(event) =>
                  updateField("logo_url", event.target.value)
                }
                placeholder="/storage/trusted-brands/logo.webp"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-website-url">Website URL</Label>
              <Input
                id="brand-website-url"
                value={form.website_url}
                onChange={(event) =>
                  updateField("website_url", event.target.value)
                }
                placeholder="https://example.com"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="brand-active"
                type="checkbox"
                className="size-4 rounded border-input"
                checked={form.is_active}
                onChange={(event) =>
                  updateField("is_active", event.target.checked)
                }
              />
              <Label htmlFor="brand-active">Active sponsor</Label>
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
              {brand ? "Update sponsor" : "Create sponsor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
