import { ApiResponse } from "@shared/store/ApiStore/types";
export type GetOrganizationReposListParams = {
  organizationName: string;
  per_page: number;
  page: number;
};
export type GetNewRepoParams = {
  name: string;
  isPrivate: true;
  authToken: string;
};

export type GetReposBranchesListParams = {
  organizationName: string | undefined;
  repoName: string | undefined;
};

type Owner = {
  login: string;
  repos_url: string;
  organizations_url: string;
  updated_at: string;
  avatar_url: string;
  html_url: string;
};

export type RepoItem = {
  id: number;
  name: string;
  owner: Owner;
  stargazers_count: number;
  updated_at: string;
};

export type RepoDetails = {
  default_branch: string;
  full_name: string;
  html_url: string;
  name: string;
  owner: Owner;
};
export interface IGitHubStore {
  getOrganizationReposList(
    params: GetOrganizationReposListParams
  ): Promise<void>;
  createRepoAuthUser(
    params: GetNewRepoParams
  ): Promise<ApiResponse<RepoDetails, any>>;
}
