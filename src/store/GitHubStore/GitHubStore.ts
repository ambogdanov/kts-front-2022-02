import ApiStore from "@apiStore";
import {
  ApiResponse,
  HTTPMethod,
  RequestParams,
} from "@shared/store/ApiStore/types";

import log from "../../Logger/Logger";
import {
  IGitHubStore,
  RepoItem,
  GetOrganizationReposListParams,
  GetNewRepoParams,
  RepoDetails,
  GetReposBranchesListParams,
} from "./types";

const baseUrl: string = "https://api.github.com/";

export default class GitHubStore implements IGitHubStore {
  private readonly apiStore = new ApiStore(baseUrl);

  async getOrganizationReposList({
    organizationName,
  }: GetOrganizationReposListParams): Promise<ApiResponse<RepoItem[], any>> {
    const params: RequestParams<{}> = {
      method: HTTPMethod.GET,
      endpoint: `orgs/${organizationName}/repos`,
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      data: {
        per_page: "12",
      },
    };
    return await this.apiStore.request(params);
    // Документация github: https://docs.github.com/en/rest/reference/repos#list-organization-repositories
  }

  async getReposBranchesList({
    organizationName,
    repoName,
  }: GetReposBranchesListParams): Promise<ApiResponse<RepoItem[], any>> {
    log(repoName);
    const params: RequestParams<{}> = {
      method: HTTPMethod.GET,
      endpoint: `repos/${organizationName}/${repoName}/branches`,
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      data: {},
    };
    return await this.apiStore.request(params);
    // Документация github: https://docs.github.com/en/rest/reference/repos#list-organization-repositories
  }

  async createRepoAuthUser({
    name,
    isPrivate,
    authToken,
  }: GetNewRepoParams): Promise<ApiResponse<RepoDetails, any>> {
    const params: RequestParams<{}> = {
      method: HTTPMethod.POST,
      endpoint: `user/repos`,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        name: `${name}`,
        private: `${isPrivate}`,
        Authorization: "token OAUTH-TOKEN",
      },
    };
    return await this.apiStore.request(params);
    // Документация github: https://docs.github.com/en/rest/reference/repos#create-a-repository-for-the-authenticated-user
  }
}
