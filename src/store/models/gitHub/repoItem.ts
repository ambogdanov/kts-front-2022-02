import {
  normalizeOwner,
  OwnerApi,
  OwnerModel,
} from "@store/models/gitHub/repoOwner";

export type RepoItemApi = {
  id: number;
  name: string;
  owner: OwnerApi;
  stargazers_count: number;
  updated_at: string;
};

export type RepoItemModel = {
  id: number;
  name: string;
  owner: OwnerModel;
  stargazersCount: number;
  updatedAt: string;
};

export const normalizeRepoItem = (from: RepoItemApi): RepoItemModel => ({
  id: from.id,
  name: from.name,
  owner: normalizeOwner(from.owner),
  stargazersCount: from.stargazers_count,
  updatedAt: new Date(from.updated_at)
    .toUTCString()
    .split(" ")
    .slice(1, 3)
    .join(" "),
});
