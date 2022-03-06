export type OwnerApi = {
  id: number;
  login: string;
  repos_url: string;
  organizations_url: string;
  updated_at: string;
  avatar_url: string;
  html_url: string;
};

export type OwnerModel = {
  id: number;
  login: string;
  reposUrl: string;
  organizations_url: string;
  updatedAt: string;
  avatarUrl: string;
  htmlUrl: string;
};

export const normalizeOwner = (from: OwnerApi): OwnerModel => ({
  id: from.id,
  login: from.login,
  reposUrl: from.repos_url,
  organizations_url: from.organizations_url,
  updatedAt: from.updated_at,
  avatarUrl: from.avatar_url,
  htmlUrl: from.html_url,
});
