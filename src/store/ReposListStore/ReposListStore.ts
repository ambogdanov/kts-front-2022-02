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
import rootStore from "@store/RootStore";
import { Meta } from "@utils/meta";
import { ILocalStore } from "@utils/useLocalStore";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import log from "../../utils/log/Logger";

export interface IReposListStore {
  _getOrganizationReposList(
    params: GetOrganizationReposListParams
  ): Promise<void>;
}

type PrivateFields =
  | "_list"
  | "_meta"
  | "_perPage"
  | "_searchValue"
  | "_inputValue"
  | "_page";

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
  private readonly _apiStore = rootStore.apiStore;
  private readonly _perPage: number = 12;
  private _page: number = 1;
  private _inputValue: string = "google";
  private _searchValue: string = "";

  constructor() {
    makeObservable<ReposListStore, PrivateFields>(this, {
      _list: observable.ref,
      _meta: observable,
      _perPage: observable,
      _searchValue: observable,
      _inputValue: observable,
      _page: observable,
      list: computed,
      meta: computed,
      inputValue: computed,
      _getOrganizationReposList: action,
      destroy: action,
      loadFirstPage: action.bound,
      setInputValue: action.bound,
    });
  }

  setInputValue(value: string) {
    this._inputValue = value;
  }

  get inputValue() {
    return this._inputValue;
  }

  get list(): RepoItemModel[] {
    return linearizeCollection(this._list);
  }

  get meta(): Meta {
    return this._meta;
  }

  async _getOrganizationReposList({
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

  loadFirstPage(): void {
    if (this._searchValue === this._inputValue) {
      return;
    } else {
      this._searchValue = this._inputValue;
      this._page = 1;
      this._getOrganizationReposList({
        page: 1,
        per_page: this._perPage,
        organizationName: this._searchValue,
      });
    }
  }
}
