import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowDown,
  ArrowUp,
  Edit3,
  FolderOpen,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ContentWrapper } from "@/components/common/ContentWrapper";
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
import {
  createGalleryFolder,
  createGalleryImage,
  deleteGalleryFolder,
  deleteGalleryImage,
  getAdminGalleryFolders,
  reorderGalleryFolders,
  reorderGalleryImages,
  updateGalleryFolder,
  updateGalleryImage,
  uploadGalleryImage,
  type GalleryFolder,
  type GalleryFolderPayload,
  type GalleryImage,
  type GalleryImageOrientation,
  type GalleryImagePayload,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

type FolderForm = {
  title: string;
  slug: string;
  description: string;
  cover_image_url: string;
  is_active: boolean;
};

type ImageForm = {
  title: string;
  image_url: string;
  orientation: GalleryImageOrientation;
  is_active: boolean;
};

type UploadState = {
  total: number;
  completed: number;
  failed: number;
  currentFile: string;
};

const initialAdminVisibleImages = 18;
const adminVisibleImageBatchSize = 18;

const emptyFolderForm: FolderForm = {
  title: "",
  slug: "",
  description: "",
  cover_image_url: "",
  is_active: true,
};

function folderToForm(folder?: GalleryFolder | null): FolderForm {
  if (!folder) {
    return emptyFolderForm;
  }

  return {
    title: folder.title,
    slug: folder.slug,
    description: folder.description ?? "",
    cover_image_url: folder.cover_image_url ?? "",
    is_active: folder.is_active,
  };
}

function folderFormToPayload(form: FolderForm): GalleryFolderPayload {
  return {
    title: form.title,
    slug: form.slug,
    description: form.description || null,
    cover_image_url: form.cover_image_url || null,
    is_active: form.is_active,
  };
}

function imageToForm(image?: GalleryImage | null): ImageForm {
  return {
    title: image?.title ?? "",
    image_url: image?.image_url ?? "",
    orientation: image?.orientation ?? "landscape",
    is_active: image?.is_active ?? true,
  };
}

function imageFormToPayload(form: ImageForm): GalleryImagePayload {
  return {
    title: form.title || null,
    image_url: form.image_url,
    orientation: form.orientation,
    is_active: form.is_active,
  };
}

function guessOrientation(file: File): GalleryImageOrientation {
  if (file.type.includes("png") || file.name.toLowerCase().includes("square")) {
    return "square";
  }

  return "landscape";
}

function galleryUploadErrorMessage(error: unknown, fileName: string) {
  if (!axios.isAxiosError(error)) {
    return `${fileName} could not be uploaded.`;
  }

  const data = error.response?.data as
    | {
        message?: string;
        errors?: Record<string, string[]>;
        limits?: {
          upload_max_filesize?: string;
          post_max_size?: string;
        };
      }
    | undefined;
  const serverMessage = data?.errors?.file?.[0] ?? data?.message;

  if (error.response?.status === 413) {
    return `${fileName} is larger than the server upload limit.`;
  }

  if (data?.limits?.upload_max_filesize) {
    return `${fileName}: ${serverMessage ?? "Upload failed"} Server limit is ${data.limits.upload_max_filesize}.`;
  }

  return `${fileName}: ${serverMessage ?? "Upload failed."}`;
}

export function GalleryPage() {
  const queryClient = useQueryClient();
  const { folderId } = useParams();
  const loadMoreImagesRef = useRef<HTMLDivElement | null>(null);
  const [editingFolder, setEditingFolder] = useState<GalleryFolder | null>(null);
  const [deleteFolderTarget, setDeleteFolderTarget] =
    useState<GalleryFolder | null>(null);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deleteImageTarget, setDeleteImageTarget] =
    useState<GalleryImage | null>(null);
  const [uploadState, setUploadState] = useState<UploadState | null>(null);
  const [visibleImageCount, setVisibleImageCount] = useState(
    initialAdminVisibleImages,
  );

  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["admin-gallery-folders"],
    queryFn: getAdminGalleryFolders,
  });

  const selectedFolder = useMemo(
    () => data.find((folder) => String(folder.id) === folderId),
    [data, folderId],
  );
  const isFolderDetail = Boolean(folderId);
  const activeCount = useMemo(
    () => data.filter((folder) => folder.is_active).length,
    [data],
  );

  useEffect(() => {
    setVisibleImageCount(initialAdminVisibleImages);
  }, [folderId]);

  async function refreshGallery() {
    await queryClient.invalidateQueries({ queryKey: ["admin-gallery-folders"] });
    await queryClient.invalidateQueries({ queryKey: ["gallery-folders"] });
  }

  const createFolderMutation = useMutation({
    mutationFn: createGalleryFolder,
    onSuccess: async () => {
      toast.success("Gallery folder created.");
      setIsFolderDialogOpen(false);
      await refreshGallery();
    },
    onError: () => toast.error("Failed to create gallery folder."),
  });

  const updateFolderMutation = useMutation({
    mutationFn: updateGalleryFolder,
    onSuccess: async () => {
      toast.success("Gallery folder updated.");
      setIsFolderDialogOpen(false);
      setEditingFolder(null);
      await refreshGallery();
    },
    onError: () => toast.error("Failed to update gallery folder."),
  });

  const deleteFolderMutation = useMutation({
    mutationFn: deleteGalleryFolder,
    onSuccess: async () => {
      toast.success("Gallery folder deleted.");
      setDeleteFolderTarget(null);
      await refreshGallery();
    },
    onError: () => toast.error("Failed to delete gallery folder."),
  });

  const reorderFolderMutation = useMutation({
    mutationFn: reorderGalleryFolders,
    onSuccess: refreshGallery,
    onError: () => toast.error("Failed to update folder order."),
  });

  const updateImageMutation = useMutation({
    mutationFn: updateGalleryImage,
    onSuccess: async () => {
      toast.success("Image updated.");
      setEditingImage(null);
      await refreshGallery();
    },
    onError: () => toast.error("Failed to update image."),
  });

  const deleteImageMutation = useMutation({
    mutationFn: deleteGalleryImage,
    onSuccess: async () => {
      toast.success("Image deleted.");
      setDeleteImageTarget(null);
      await refreshGallery();
    },
    onError: () => toast.error("Failed to delete image."),
  });

  const reorderImageMutation = useMutation({
    mutationFn: reorderGalleryImages,
    onSuccess: refreshGallery,
    onError: () => toast.error("Failed to update image order."),
  });

  function openAddFolderDialog() {
    setEditingFolder(null);
    setIsFolderDialogOpen(true);
  }

  function openEditFolderDialog(folder: GalleryFolder) {
    setEditingFolder(folder);
    setIsFolderDialogOpen(true);
  }

  function submitFolder(form: FolderForm) {
    const payload = folderFormToPayload(form);

    if (editingFolder) {
      updateFolderMutation.mutate({ id: editingFolder.id, folder: payload });
      return;
    }

    createFolderMutation.mutate(payload);
  }

  function moveFolder(folderId: number, direction: -1 | 1) {
    const index = data.findIndex((folder) => folder.id === folderId);
    const targetIndex = index + direction;

    if (index < 0 || targetIndex < 0 || targetIndex >= data.length) {
      return;
    }

    const next = [...data];
    const [folder] = next.splice(index, 1);
    next.splice(targetIndex, 0, folder);
    reorderFolderMutation.mutate(next.map((item) => item.id));
  }

  function moveImage(imageId: number, direction: -1 | 1) {
    if (!selectedFolder?.images) {
      return;
    }

    const index = selectedFolder.images.findIndex((image) => image.id === imageId);
    const targetIndex = index + direction;

    if (index < 0 || targetIndex < 0 || targetIndex >= selectedFolder.images.length) {
      return;
    }

    const next = [...selectedFolder.images];
    const [image] = next.splice(index, 1);
    next.splice(targetIndex, 0, image);
    reorderImageMutation.mutate({
      folderId: selectedFolder.id,
      ids: next.map((item) => item.id),
    });
  }

  async function handleGalleryUploads(files: FileList | null) {
    if (!selectedFolder) {
      toast.error("Select a folder before uploading images.");
      return;
    }

    if (!files || files.length === 0) {
      return;
    }

    const targetFolder = selectedFolder;
    const selectedFiles = Array.from(files);
    let uploadedCount = 0;
    let failedCount = 0;

    setUploadState({
      total: selectedFiles.length,
      completed: 0,
      failed: 0,
      currentFile: selectedFiles[0]?.name ?? "",
    });

    for (const [index, file] of selectedFiles.entries()) {
      setUploadState({
        total: selectedFiles.length,
        completed: index,
        failed: failedCount,
        currentFile: file.name,
      });

      if (file.size > 16 * 1024 * 1024) {
        failedCount += 1;
        toast.error(`${file.name} is larger than 16MB.`);
        continue;
      }

      try {
        const media = await uploadGalleryImage(file);
        await createGalleryImage({
          folderId: targetFolder.id,
          image: {
            title: file.name.replace(/\.[^/.]+$/, ""),
            image_url: media.url,
            orientation: guessOrientation(file),
            is_active: true,
          },
        });
        uploadedCount += 1;
      } catch (error) {
        failedCount += 1;
        toast.error(galleryUploadErrorMessage(error, file.name));
      }
    }

    setUploadState({
      total: selectedFiles.length,
      completed: selectedFiles.length,
      failed: failedCount,
      currentFile: "",
    });

    if (uploadedCount > 0) {
      toast.success(
        `${uploadedCount} image${uploadedCount > 1 ? "s" : ""} uploaded to ${targetFolder.title}.`,
      );
    }

    if (failedCount > 0 && uploadedCount > 0) {
      toast.error(
        `${failedCount} image${failedCount > 1 ? "s" : ""} could not be uploaded.`,
      );
    }

    await refreshGallery();
    setUploadState(null);
  }

  const folderPending =
    createFolderMutation.isPending || updateFolderMutation.isPending;
  const selectedImages = selectedFolder?.images ?? [];
  const visibleImages = selectedImages.slice(0, visibleImageCount);
  const hasMoreImages = visibleImageCount < selectedImages.length;
  const isUploading = Boolean(uploadState);

  useEffect(() => {
    if (!hasMoreImages) {
      return;
    }

    const sentinel = loadMoreImagesRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }

        setVisibleImageCount((currentCount) =>
          Math.min(
            currentCount + adminVisibleImageBatchSize,
            selectedImages.length,
          ),
        );
      },
      { rootMargin: "700px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMoreImages, selectedImages.length]);

  return (
    <ContentWrapper>
      <PageHeader
        title={isFolderDetail ? selectedFolder?.title ?? "Folder Images" : "Gallery"}
        description={
          isFolderDetail
            ? "Manage images inside this gallery folder."
            : "Manage folders displayed on the public Gallery page."
        }
        actions={
          isFolderDetail ? (
            <Button asChild variant="outline">
              <Link to="/administrator/gallery">Back to folders</Link>
            </Button>
          ) : (
            <Button
              type="button"
              className="bg-[#07503d] text-white hover:bg-[#064433]"
              onClick={openAddFolderDialog}
            >
              <Plus className="size-4" />
              Add folder
            </Button>
          )
        }
      />

      <div className="grid gap-6">
        {!isFolderDetail && (
        <Card className="gap-0 rounded-lg py-0">
          <CardHeader className="border-b px-4 py-4">
            <CardTitle>Gallery Folders</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.length} folders, {activeCount} active
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3">
              <TableHeader>
                <TableRow>
                  <TableHead>Folder</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Order</TableHead>
                  <TableHead className="w-24 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-28 text-center">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Loading gallery...
                      </span>
                    </TableCell>
                  </TableRow>
                )}

                {isError && !isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-28 text-center text-destructive">
                      Gallery backend is not available.
                    </TableCell>
                  </TableRow>
                )}

                {!isLoading && !isError && data.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="h-28 text-center text-muted-foreground">
                      No folders yet. Click Add folder to create one.
                    </TableCell>
                  </TableRow>
                )}

                {data.map((folder, index) => (
                  <TableRow
                    key={folder.id}
                        className={selectedFolder?.id === folder.id ? "bg-muted/45" : undefined}
                  >
                    <TableCell>
                      <Link
                        to={`/administrator/gallery/${folder.id}`}
                        className="flex w-full items-center gap-3 text-left"
                      >
                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/30">
                          {folder.cover_image_url ? (
                            <img
                              src={folder.cover_image_url}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <FolderOpen className="size-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-normal">{folder.title}</p>
                          </div>
                          <p className="mt-1 truncate text-xs text-muted-foreground">
                            {folder.images_count ?? folder.images?.length ?? 0} images
                          </p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={folder.is_active ? "bg-[#07503d] text-white" : undefined}
                        variant={folder.is_active ? "default" : "outline"}
                      >
                        {folder.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => moveFolder(folder.id, -1)}
                          disabled={index === 0 || reorderFolderMutation.isPending}
                        >
                          <ArrowUp className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => moveFolder(folder.id, 1)}
                          disabled={index === data.length - 1 || reorderFolderMutation.isPending}
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
                          asChild
                          title="Manage images"
                        >
                          <Link to={`/administrator/gallery/${folder.id}`}>
                            <ImageIcon className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => openEditFolderDialog(folder)}
                        >
                          <Edit3 className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteFolderTarget(folder)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        )}

        {isFolderDetail && (
        <Card className="gap-0 rounded-lg py-0">
          <CardHeader className="border-b px-4 py-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>{selectedFolder?.title ?? "Folder Images"}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedFolder
                    ? `${selectedImages.length} images in selected folder`
                    : "Select a folder before uploading images"}
                </p>
              </div>
              <label
                htmlFor="gallery-image-upload"
                aria-disabled={!selectedFolder || isUploading}
                className={cn(
                  "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 text-sm font-normal text-zinc-950 shadow-xs transition-all hover:bg-zinc-100",
                  !selectedFolder || isUploading
                    ? "pointer-events-none cursor-not-allowed opacity-50"
                    : "cursor-pointer",
                )}
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {isUploading ? "Uploading..." : "Upload images"}
              </label>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <input
              id="gallery-image-upload"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={!selectedFolder || isUploading}
              onChange={(event) => {
                void handleGalleryUploads(event.target.files);
                event.target.value = "";
              }}
            />

            {!selectedFolder ? (
              <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                <FolderOpen className="size-10 text-muted-foreground" />
                <p className="mt-4 text-sm font-medium">Select a folder first</p>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Choose a gallery folder on the left before uploading images.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        Selected folder: {selectedFolder.title}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        JPG, PNG, WEBP, or GIF. Maximum 16MB per image.
                      </p>
                      {uploadState && (
                        <p className="mt-2 text-xs text-zinc-500">
                          {uploadState.currentFile
                            ? `Uploading ${uploadState.currentFile}`
                            : "Finalizing upload"}{" "}
                          ({uploadState.completed}/{uploadState.total})
                        </p>
                      )}
                    </div>
                    <label
                      htmlFor="gallery-image-upload"
                      aria-disabled={isUploading}
                      className={cn(
                        "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#07503d] px-3 text-sm font-normal text-white shadow-xs transition-all hover:bg-[#064433]",
                        isUploading
                          ? "pointer-events-none cursor-not-allowed opacity-50"
                          : "cursor-pointer",
                      )}
                    >
                      {isUploading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      {isUploading ? "Uploading..." : "Add images"}
                    </label>
                  </div>
                  {uploadState && (
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-[#07503d] transition-all"
                        style={{
                          width: `${Math.round((uploadState.completed / uploadState.total) * 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {selectedImages.length === 0 ? (
                  <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border bg-background px-6 text-center">
                    <ImageIcon className="size-10 text-muted-foreground" />
                    <p className="mt-4 text-sm font-medium">
                      No images in {selectedFolder.title} yet.
                    </p>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      Use the upload button above to add photos to this folder.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleImages.map((image, index) => (
                  <article key={image.id} className="overflow-hidden rounded-lg border bg-muted/20">
                    <div className="aspect-[1.25] bg-muted">
                      {image.image_url ? (
                        <img
                          src={image.image_url}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <ImageIcon className="size-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 p-3">
                      <div>
                        <p className="truncate text-sm font-medium">
                          {image.title || "Untitled image"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {image.orientation}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => moveImage(image.id, -1)}
                            disabled={index === 0 || reorderImageMutation.isPending}
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => moveImage(image.id, 1)}
                            disabled={index === selectedImages.length - 1 || reorderImageMutation.isPending}
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setEditingImage(image)}
                          >
                            <Edit3 className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setDeleteImageTarget(image)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                    ))}
                  </div>
                )}
                {selectedImages.length > initialAdminVisibleImages && (
                  <div
                    ref={loadMoreImagesRef}
                    className="flex min-h-16 items-center justify-center"
                  >
                    {hasMoreImages ? (
                      <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        Loading more images...
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        All images loaded
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        )}
      </div>

      <FolderDialog
        key={editingFolder?.id ?? "new-folder"}
        open={isFolderDialogOpen}
        folder={editingFolder}
        pending={folderPending}
        onOpenChange={setIsFolderDialogOpen}
        onSubmit={submitFolder}
      />

      <ImageDialog
        key={editingImage?.id ?? "image"}
        open={Boolean(editingImage)}
        image={editingImage}
        pending={updateImageMutation.isPending}
        onOpenChange={(open) => !open && setEditingImage(null)}
        onSubmit={(form) =>
          editingImage &&
          updateImageMutation.mutate({
            id: editingImage.id,
            image: imageFormToPayload(form),
          })
        }
      />

      <ConfirmDialog
        open={Boolean(deleteFolderTarget)}
        title="Delete folder?"
        description="This folder and all images inside it will be removed from the public gallery."
        pending={deleteFolderMutation.isPending}
        onCancel={() => setDeleteFolderTarget(null)}
        onConfirm={() =>
          deleteFolderTarget && deleteFolderMutation.mutate(deleteFolderTarget.id)
        }
      />

      <ConfirmDialog
        open={Boolean(deleteImageTarget)}
        title="Delete image?"
        description="This image will be removed from the gallery folder."
        pending={deleteImageMutation.isPending}
        onCancel={() => setDeleteImageTarget(null)}
        onConfirm={() =>
          deleteImageTarget && deleteImageMutation.mutate(deleteImageTarget.id)
        }
      />
    </ContentWrapper>
  );
}

function FolderDialog({
  open,
  folder,
  pending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  folder: GalleryFolder | null;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: FolderForm) => void;
}) {
  const [form, setForm] = useState<FolderForm>(() => folderToForm(folder));

  useEffect(() => {
    if (open) {
      setForm(folderToForm(folder));
    }
  }, [folder, open]);

  function updateField<Key extends keyof FolderForm>(
    field: Key,
    value: FolderForm[Key],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{folder ? "Edit folder" : "Add folder"}</DialogTitle>
            <DialogDescription>
              This folder will appear as a card on the public Gallery page.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="gallery-folder-title">Title</Label>
              <Input
                id="gallery-folder-title"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="PXDL Junior Cup 2026"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="gallery-folder-active"
                type="checkbox"
                className="size-4 rounded border-input"
                checked={form.is_active}
                onChange={(event) => updateField("is_active", event.target.checked)}
              />
              <Label htmlFor="gallery-folder-active">Active folder</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#07503d] text-white hover:bg-[#064433]"
              disabled={pending}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              {folder ? "Update folder" : "Create folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ImageDialog({
  open,
  image,
  pending,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  image: GalleryImage | null;
  pending: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: ImageForm) => void;
}) {
  const [form, setForm] = useState<ImageForm>(() => imageToForm(image));

  useEffect(() => {
    if (open) {
      setForm(imageToForm(image));
    }
  }, [image, open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit image</DialogTitle>
            <DialogDescription>
              Edit the gallery image title, URL, orientation, and status.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="aspect-[1.45] overflow-hidden rounded-lg border bg-muted/30">
              {form.image_url ? (
                <img src={form.image_url} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <ImageIcon className="size-8 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery-image-title">Title</Label>
              <Input
                id="gallery-image-title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Team celebration"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gallery-image-url">Image URL</Label>
              <Input
                id="gallery-image-url"
                value={form.image_url}
                onChange={(event) =>
                  setForm((current) => ({ ...current, image_url: event.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Orientation</Label>
              <Select
                value={form.orientation}
                onValueChange={(value: GalleryImageOrientation) =>
                  setForm((current) => ({ ...current, orientation: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="landscape">Landscape</SelectItem>
                  <SelectItem value="portrait">Portrait</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="gallery-image-active"
                type="checkbox"
                className="size-4 rounded border-input"
                checked={form.is_active}
                onChange={(event) =>
                  setForm((current) => ({ ...current, is_active: event.target.checked }))
                }
              />
              <Label htmlFor="gallery-image-active">Active image</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#07503d] text-white hover:bg-[#064433]"
              disabled={pending}
            >
              {pending && <Loader2 className="size-4 animate-spin" />}
              Update image
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDialog({
  open,
  title,
  description,
  pending,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" disabled={pending} onClick={onConfirm}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
