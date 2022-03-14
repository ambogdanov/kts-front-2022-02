export type GetReposBranchesListParams = {
  organizationName: string | undefined;
  repoName: string | undefined;
};

export type PrivateFields = "_list" | "_meta";

export interface IRepoBranchesStore {
  getReposBranchesList(params: GetReposBranchesListParams): Promise<void>;
}
