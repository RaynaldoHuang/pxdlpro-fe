import axios from "axios";
import edu2Image from "@/assets/Edu-2.png";
import gemmaImage from "@/assets/gemma.png";

export const rankingCategoryOptions = [
  { label: "PXDL Elite", value: "pxdl_elite" },
  { label: "PXDL Squad", value: "pxdl_squad" },
  { label: "PXDL Member", value: "pxdl_member" },
] as const;

export const playerGenderOptions = [
  { label: "Men", value: "men" },
  { label: "Women", value: "women" },
] as const;

export type RankingCategoryValue =
  (typeof rankingCategoryOptions)[number]["value"];
export type PlayerGenderValue = (typeof playerGenderOptions)[number]["value"];

export type Player = {
  id: number;
  rank: number;
  points: number;
  name: string;
  image_url: string;
  formal_image_url: string | null;
  gender: PlayerGenderValue;
  ranking_category: RankingCategoryValue;
  sort_order: number;
  is_active: boolean;
};

type PlayersResponse = {
  data: Player[];
  message?: string;
};

export type PlayerPayload = Omit<Player, "id" | "rank" | "sort_order"> & {
  id?: number;
};

type UploadedPlayerImage = {
  path: string;
  url: string;
  type: "image";
  mime_type: string;
  original_name: string;
  size: number;
};

export function getRankingCategoryLabel(value: RankingCategoryValue) {
  return (
    rankingCategoryOptions.find((option) => option.value === value)?.label ??
    value
  );
}

export function getPlayerGenderLabel(value: PlayerGenderValue) {
  return (
    playerGenderOptions.find((option) => option.value === value)?.label ?? value
  );
}

export function getPlayerRankingImage(player: Player) {
  const fallbackImage = player.gender === "women" ? gemmaImage : edu2Image;

  if (player.rank > 10) {
    return player.formal_image_url || player.image_url || fallbackImage;
  }

  return player.image_url || player.formal_image_url || fallbackImage;
}

export async function getPlayers(rankingCategory?: RankingCategoryValue) {
  const response = await axios.get<PlayersResponse>("/api/players", {
    params: rankingCategory ? { ranking_category: rankingCategory } : undefined,
  });

  return response.data.data;
}

export async function getAdminPlayers() {
  const response = await axios.get<PlayersResponse>("/api/admin/players");

  return response.data.data;
}

export async function createPlayer(player: PlayerPayload) {
  const response = await axios.post<{
    data: Player;
    message: string;
  }>("/api/admin/players", player);

  return response.data;
}

export async function updatePlayer({
  id,
  player,
}: {
  id: number;
  player: PlayerPayload;
}) {
  const response = await axios.patch<{
    data: Player;
    message: string;
  }>(`/api/admin/players/${id}`, player);

  return response.data;
}

export async function deletePlayer(id: number) {
  const response = await axios.delete<{
    message: string;
  }>(`/api/admin/players/${id}`);

  return response.data;
}

export async function uploadPlayerImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post<{
    data: UploadedPlayerImage;
    message: string;
  }>("/api/admin/uploads/players", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
}
