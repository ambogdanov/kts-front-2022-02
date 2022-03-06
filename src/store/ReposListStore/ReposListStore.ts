import ApiStore from "@apiStore";
import { HTTPMethod, RequestParams } from "@shared/store/ApiStore/types";
import { GetOrganizationReposListParams } from "@store/GitHubStore/types";
import {
  normalizeRepoItem,
  RepoItemApi,
  RepoItemModel,
} from "@store/models/gitHub";
import {
  CollectionModel,
  getInitialCollectionModel,
  linearizeCollection,
  normalizeCollection,
} from "@store/models/shared/collections";
import { Meta } from "@utils/meta";
import { ILocalStore } from "@utils/useLocalStore";
import {
  set,
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import log from "../../utils/log/Logger";

const baseUrl: string = "https://api.github.com/";

export interface IReposListStore {
  getOrganizationReposList(
    params: GetOrganizationReposListParams
  ): Promise<void>;
}

type PrivateFields = "_list" | "_meta";

export default class ReposListStore implements IReposListStore, ILocalStore {
  destroy(): void {
    this._list = getInitialCollectionModel();
    this._meta = Meta.initial;
  }

  private _list: CollectionModel<number, RepoItemModel> = {
    order: [],
    entities: {},
  };
  private _meta: Meta = Meta.initial;
  private readonly _apiStore = new ApiStore(baseUrl);

  constructor() {
    makeObservable<ReposListStore, PrivateFields>(this, {
      _list: observable.ref,
      _meta: observable,
      list: computed,
      meta: computed,
      getOrganizationReposList: action,
      destroy: action,
    });
  }

  async getOrganizationReposList({
    organizationName,
    per_page,
    page,
  }: GetOrganizationReposListParams): Promise<void> {
    if (page === 1) {
      this._list = getInitialCollectionModel();
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
    const response = await this._apiStore.request<RepoItemApi[]>(params);
    runInAction(() => {
      if (!response.success) {
        this._meta = Meta.error;
      }
      try {
        const list: RepoItemModel[] = [];
        for (const item of response.data) {
          list.push(normalizeRepoItem(item));
        }
        this._list = normalizeCollection(
          this._list,
          list,
          (listItem) => listItem.id
        );
        this._meta = Meta.success;
        return;
      } catch (e) {
        log(
          `Ошибка при нормализации и присвоении нового _list в RepoListStore ${e}`
        );
        this._meta = Meta.error;
        this._list = getInitialCollectionModel();
      }
    });

    // Документация github: https://docs.github.com/en/rest/reference/repos#list-organization-repositories
  }
  get list(): RepoItemModel[] {
    return linearizeCollection(this._list);
  }

  get meta(): Meta {
    return this._meta;
  }
}
