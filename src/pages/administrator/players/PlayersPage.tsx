import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Edit3,
  ImageIcon,
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
import { useClientPagination } from "@/hooks/useClientPagination";
import {
  createPlayer,
  deletePlayer,
  getAdminPlayers,
  getPlayerGenderLabel,
  getRankingCategoryLabel,
  playerGenderOptions,
  rankingCategoryOptions,
  updatePlayer,
  uploadPlayerImage,
  type Player,
  type PlayerGenderValue,
  type PlayerPayload,
  type RankingCategoryValue,
} from "@/lib/players";
import { uploadErrorMessage } from "@/lib/uploadErrors";

type PlayerForm = {
  points: string;
  name: string;
  image_url: string;
  gender: PlayerGenderValue;
  ranking_category: RankingCategoryValue;
  is_active: boolean;
};

const emptyForm: PlayerForm = {
  points: "0",
  name: "",
  image_url: "",
  gender: "men",
  ranking_category: "pxdl_elite",
  is_active: true,
};

function playerToForm(player?: Player | null): PlayerForm {
  if (!player) {
    return emptyForm;
  }

  return {
    points: String(player.points),
    name: player.name,
    image_url: player.image_url,
    gender: player.gender,
    ranking_category: player.ranking_category,
    is_active: player.is_active,
  };
}

function formToPayload(form: PlayerForm): PlayerPayload {
  return {
    points: Number(form.points),
    name: form.name,
    image_url: form.image_url,
    gender: form.gender,
    ranking_category: form.ranking_category,
    is_active: form.is_active,
  };
}

export function PlayersPage() {
  const queryClient = useQueryClient();
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Player | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] =
    useState<RankingCategoryValue>("pxdl_elite");
  const [genderFilter, setGenderFilter] = useState<PlayerGenderValue>("men");
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["admin-players"],
    queryFn: getAdminPlayers,
  });

  const visiblePlayers = useMemo(
    () =>
      data
        .filter(
          (player) =>
            player.ranking_category === categoryFilter &&
            player.gender === genderFilter,
        )
        .sort((first, second) => {
          if (first.rank !== second.rank) {
            return first.rank - second.rank;
          }

          return second.points - first.points;
        }),
    [categoryFilter, data, genderFilter],
  );
  const activeCount = useMemo(
    () => data.filter((player) => player.is_active).length,
    [data],
  );

  async function refreshPlayers() {
    await queryClient.invalidateQueries({ queryKey: ["admin-players"] });
    await queryClient.invalidateQueries({ queryKey: ["players"] });
  }

  const createMutation = useMutation({
    mutationFn: createPlayer,
    onSuccess: async () => {
      toast.success("Player berhasil ditambahkan.");
      setIsEditorOpen(false);
      await refreshPlayers();
    },
    onError: () => toast.error("Gagal menambahkan player."),
  });

  const updateMutation = useMutation({
    mutationFn: updatePlayer,
    onSuccess: async () => {
      toast.success("Player berhasil diupdate.");
      setIsEditorOpen(false);
      setEditingPlayer(null);
      await refreshPlayers();
    },
    onError: () => toast.error("Gagal mengupdate player."),
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlayer,
    onSuccess: async () => {
      toast.success("Player berhasil dihapus.");
      setDeleteTarget(null);
      await refreshPlayers();
    },
    onError: () => toast.error("Gagal menghapus player."),
  });

  function openAddDialog() {
    setEditingPlayer(null);
    setIsEditorOpen(true);
  }

  function openEditDialog(player: Player) {
    setEditingPlayer(player);
    setIsEditorOpen(true);
  }

  function submitEditor(form: PlayerForm) {
    const payload = formToPayload(form);

    if (editingPlayer) {
      updateMutation.mutate({ id: editingPlayer.id, player: payload });
      return;
    }

    createMutation.mutate(payload);
  }

  const editorPending = createMutation.isPending || updateMutation.isPending;
  const playerPagination = useClientPagination(visiblePlayers);

  return (
    <ContentWrapper>
      <PageHeader
        title="Players"
        description="Kelola player ranking yang tampil di section Players website publik."
        actions={
          <Button
            type="button"
            className="bg-[#07503d] text-white hover:bg-[#064433]"
            onClick={openAddDialog}
          >
            <Plus className="size-4" />
            Add player
          </Button>
        }
      />

      <Card className="gap-0 rounded-lg py-0">
        <CardHeader className="border-b px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Player Rankings</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.length} players, {activeCount} active
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Select
                value={categoryFilter}
                onValueChange={(value) =>
                  setCategoryFilter(value as RankingCategoryValue)
                }
              >
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rankingCategoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={genderFilter}
                onValueChange={(value) =>
                  setGenderFilter(value as PlayerGenderValue)
                }
              >
                <SelectTrigger className="w-full sm:w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {playerGenderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table className="[&_td]:px-4 [&_td]:py-3 [&_th]:px-4 [&_th]:py-3">
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">Rank</TableHead>
                <TableHead className="w-24">Points</TableHead>
                <TableHead className="w-24">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-28 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="h-28 text-center">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Loading players...
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
                    Backend player data belum tersedia.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !isError && visiblePlayers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-28 text-center text-muted-foreground"
                  >
                    Belum ada player untuk filter ini.
                  </TableCell>
                </TableRow>
              )}

              {playerPagination.paginatedItems.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.rank}</TableCell>
                  <TableCell>{player.points}</TableCell>
                  <TableCell>
                    <div className="flex size-14 items-center justify-center overflow-hidden rounded-md border bg-muted/30">
                      {player.image_url ? (
                        <img
                          src={player.image_url}
                          alt={player.name}
                          className="size-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="size-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-normal">{player.name}</TableCell>
                  <TableCell>
                    {getRankingCategoryLabel(player.ranking_category)}
                  </TableCell>
                  <TableCell>{getPlayerGenderLabel(player.gender)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        player.is_active
                          ? "bg-[#07503d] text-white"
                          : undefined
                      }
                      variant={player.is_active ? "default" : "outline"}
                    >
                      {player.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(player)}
                        title="Edit player"
                      >
                        <Edit3 className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(player)}
                        disabled={deleteMutation.isPending}
                        title="Delete player"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            page={playerPagination.page}
            pageCount={playerPagination.pageCount}
            pageSize={playerPagination.pageSize}
            totalItems={playerPagination.totalItems}
            startItem={playerPagination.startItem}
            endItem={playerPagination.endItem}
            onPageChange={playerPagination.setPage}
            onPageSizeChange={playerPagination.setPageSize}
          />
        </CardContent>
      </Card>

      <PlayerDialog
        key={editingPlayer?.id ?? "new"}
        open={isEditorOpen}
        player={editingPlayer}
        pending={editorPending}
        defaultCategory={categoryFilter}
        defaultGender={genderFilter}
        onOpenChange={setIsEditorOpen}
        onSubmit={submitEditor}
      />

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete player?</DialogTitle>
            <DialogDescription>
              Player ini akan dihapus dari section Players website publik.
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

type PlayerDialogProps = {
  open: boolean;
  player: Player | null;
  pending: boolean;
  defaultCategory: RankingCategoryValue;
  defaultGender: PlayerGenderValue;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: PlayerForm) => void;
};

function PlayerDialog({
  open,
  player,
  pending,
  defaultCategory,
  defaultGender,
  onOpenChange,
  onSubmit,
}: PlayerDialogProps) {
  const [form, setForm] = useState<PlayerForm>(() => ({
    ...playerToForm(player),
    ranking_category: player?.ranking_category ?? defaultCategory,
    gender: player?.gender ?? defaultGender,
  }));
  const [uploadingFileName, setUploadingFileName] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (open) {
      setForm({
        ...playerToForm(player),
        ranking_category: player?.ranking_category ?? defaultCategory,
        gender: player?.gender ?? defaultGender,
      });
    }
  }, [defaultCategory, defaultGender, open, player]);

  function updateField<Key extends keyof PlayerForm>(
    field: Key,
    value: PlayerForm[Key],
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
      const media = await uploadPlayerImage(file);
      setForm((current) => ({
        ...current,
        image_url: media.url,
      }));
      toast.success("Image berhasil diupload.");
    } catch (error) {
      toast.error(uploadErrorMessage(error, "Gagal upload image."));
    } finally {
      setUploadingFileName(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{player ? "Edit player" : "Add player"}</DialogTitle>
            <DialogDescription>
              Data ini akan tampil di carousel Players website publik.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <AdminUploadField
              id="player-image-upload"
              label="Upload image"
              helperText="JPG, PNG, WEBP, GIF. Max 12MB."
              uploadingFileName={uploadingFileName}
              accept="image/jpeg,image/png,image/webp,image/gif"
              previewUrl={form.image_url}
              previewAlt={form.name || "Player preview"}
              onFileChange={(file) => void handleImageUpload(file)}
            />

            <div className="grid gap-4 sm:grid-cols-[140px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="player-points">Points</Label>
                <Input
                  id="player-points"
                  type="number"
                  min={0}
                  value={form.points}
                  onChange={(event) =>
                    updateField("points", event.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="player-name">Player name</Label>
                <Input
                  id="player-name"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Agustin Tapia"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Ranking category</Label>
                <Select
                  value={form.ranking_category}
                  onValueChange={(value) =>
                    updateField(
                      "ranking_category",
                      value as RankingCategoryValue,
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rankingCategoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(value) =>
                    updateField("gender", value as PlayerGenderValue)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {playerGenderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="player-image-url">Image URL</Label>
              <Input
                id="player-image-url"
                value={form.image_url}
                onChange={(event) =>
                  updateField("image_url", event.target.value)
                }
                placeholder="/storage/players/player.webp"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="player-active"
                type="checkbox"
                className="size-4 rounded border-input"
                checked={form.is_active}
                onChange={(event) =>
                  updateField("is_active", event.target.checked)
                }
              />
              <Label htmlFor="player-active">Active player</Label>
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
              {player ? "Update player" : "Create player"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
