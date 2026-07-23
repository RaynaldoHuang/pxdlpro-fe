import { ImageIcon, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AdminUploadFieldProps = {
  id: string;
  label: string;
  helperText: string;
  uploadingFileName: string | null;
  accept: string;
  previewUrl?: string;
  previewAlt: string;
  previewClassName?: string;
  buttonLabel?: string;
  onFileChange: (file: File | undefined) => void;
};

export function AdminUploadField({
  id,
  label,
  helperText,
  uploadingFileName,
  accept,
  previewUrl,
  previewAlt,
  previewClassName,
  buttonLabel = "Choose file",
  onFileChange,
}: AdminUploadFieldProps) {
  const isUploading = Boolean(uploadingFileName);

  return (
    <div className="grid gap-4 sm:grid-cols-[112px_1fr] sm:items-start">
      <div
        className={cn(
          "flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 p-4",
          previewClassName,
        )}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={previewAlt}
            className="size-full object-contain"
          />
        ) : (
          <ImageIcon className="size-8 text-zinc-300" />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="min-w-0 truncate text-xs text-zinc-500">
            {uploadingFileName ? `Uploading ${uploadingFileName}...` : helperText}
          </p>
          <Button
            type="button"
            variant="outline"
            className="relative overflow-hidden border-zinc-300 bg-white text-zinc-950 hover:bg-zinc-100"
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {buttonLabel}
            <input
              id={id}
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
              accept={accept}
              disabled={isUploading}
              onChange={(event) => {
                onFileChange(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
