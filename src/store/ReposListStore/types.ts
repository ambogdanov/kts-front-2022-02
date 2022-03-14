export interface IReposListStore {
  loadNextPage(): void;
  loadFirstPage(): void;
}

export type PrivateFields =
  | "_list"
  | "_meta"
  | "_perPage"
  | "_searchValue"
  | "_inputValue"
  | "_page"
  | "_getOrganizationReposList";
