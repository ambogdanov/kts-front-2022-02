import ApiStore from "@apiStore";
import {
  ApiResponse,
  HTTPMethod,
  RequestParams,
} from "@shared/store/ApiStore/types";
import { Meta } from "@utils/log/meta";
import { ILocalStore } from "@utils/log/useLocalStore";
import { makeObservable } from "mobx";

import log from "../../utils/log/Logger";
import {
  IGitHubStore,
  RepoItem,
  GetOrganizationReposListParams,
  GetNewRepoParams,
  RepoDetails,
  GetReposBranchesListParams,
} from "./types";

const baseUrl: string = "https://api.github.com/";

export default class GitHubStore implements IGitHubStore, ILocalStore {
  destroy(): void {
    //TODO
    throw new Error("Method not implemented.");
  }

  private _list: RepoItem[] = [];
  private _meta: Meta = Meta.initial;
  private readonly _apiStore = new ApiStore(baseUrl);

  constructor() {
    makeObservable(this, )
  }

  async getOrganizationReposList({
    organizationName,
    per_page,
    page,
  }: GetOrganizationReposListParams): Promise<ApiResponse<RepoItem[], any>> {
    const params: RequestParams<{}> = {
      method: HTTPMethod.GET,
      endpoint: `orgs/${organizationName}/repos`,
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      data: {
        per_page: per_page,
        page: page,
      },
    };
    return await this._apiStore.request(params);
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
    return await this._apiStore.request(params);
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
    return await this._apiStore.request(params);
    // Документация github: https://docs.github.com/en/rest/reference/repos#create-a-repository-for-the-authenticated-user
  }
}
