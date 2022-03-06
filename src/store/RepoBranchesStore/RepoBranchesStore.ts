import ApiStore from "@apiStore";
import { HTTPMethod, RequestParams } from "@shared/store/ApiStore/types";
import {
  normalizeRepoBranches,
  RepoBranchesApi,
  RepoBranchesModel,
} from "@store/models/gitHub/repoBranches";
import log from "@utils/log/Logger";
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
  GetReposBranchesListParams,
  IRepoBranchesStore,
  PrivateFields,
} from "./types";

const baseUrl: string = "https://api.github.com/";

export default class RepoBranchesStore
  implements IRepoBranchesStore, ILocalStore
{
  destroy(): void {
    this._list = [];
    this._meta = Meta.initial;
  }

  private _list: RepoBranchesModel[] = [];
  private _meta: Meta = Meta.initial;
  private readonly _apiStore = new ApiStore(baseUrl);

  constructor() {
    makeObservable<RepoBranchesStore, PrivateFields>(this, {
      _list: observable.ref,
      _meta: observable,
      list: computed,
      meta: computed,
      getReposBranchesList: action,
    });
  }

  get list(): RepoBranchesModel[] {
    return this._list;
  }

  get meta(): Meta {
    return this._meta;
  }

  async getReposBranchesList({
    organizationName,
    repoName,
  }: GetReposBranchesListParams): Promise<void> {
    this._list = [];
    this._meta = Meta.loading;
    const params: RequestParams<{}> = {
      method: HTTPMethod.GET,
      endpoint: `repos/${organizationName}/${repoName}/branches`,
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
      data: {},
    };
    const response = await this._apiStore.request<RepoBranchesApi[]>(params);
    runInAction(() => {
      if (!response.success) {
        this._meta = Meta.error;
      }
      try {
        this._meta = Meta.success;
        this._list = response.data.map(normalizeRepoBranches);
        return;
      } catch (e) {
        log(e);
        this._meta = Meta.error;
        this._list = [];
      }
    });
    // Документация github: https://docs.github.com/en/rest/reference/repos#list-organization-repositories
  }
}
