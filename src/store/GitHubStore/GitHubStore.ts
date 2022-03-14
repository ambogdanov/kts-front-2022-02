import ApiStore from "@apiStore";
import {
  ApiResponse,
  HTTPMethod,
  RequestParams,
} from "@shared/store/ApiStore/types";
import { Meta } from "@utils/meta";
import { ILocalStore } from "@utils/useLocalStore";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import {
  GetNewRepoParams,
  GetOrganizationReposListParams,
  GetReposBranchesListParams,
  IGitHubStore,
  RepoDetails,
  RepoItem,
} from "./types";

const baseUrl: string = "https://api.github.com/";

type PrivateFields = "_list" | "_meta";

export default class GitHubStore implements IGitHubStore, ILocalStore {
  destroy(): void {
    throw new Error("Method not implemented.");
  }

  private _list: RepoItem[] = [];
  private _meta: Meta = Meta.initial;
  private readonly _apiStore = new ApiStore(baseUrl);

  constructor() {
    makeObservable<GitHubStore, PrivateFields>(this, {
      _list: observable.ref,
      _meta: observable,
      list: computed,
      meta: computed,
      getOrganizationReposList: action,
    });
  }

  get list(): RepoItem[] {
    return this._list;
  }

  get meta(): Meta {
    return this._meta;
  }

  async getOrganizationReposList({
    organizationName,
    per_page,
    page,
  }: GetOrganizationReposListParams): Promise<void> {
    if (page === 1) {
      this._list = [];
    }
    this._meta = Meta.loading;
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
    const response = await this._apiStore.request<RepoItem[]>(params);
    runInAction(() => {
      if (response.success) {
        this._meta = Meta.success;
        this._list = [...this._list, ...response.data];
        return;
      }
      this._meta = Meta.error;
    });

    // Документация github: https://docs.github.com/en/rest/reference/repos#list-organization-repositories
  }

  async getReposBranchesList({
    organizationName,
    repoName,
  }: GetReposBranchesListParams): Promise<ApiResponse<RepoItem[], any>> {
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
