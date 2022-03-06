export type RepoBranchesApi = {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
};

export type RepoBranchesModel = {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
};
export const normalizeRepoBranches = (
  from: RepoBranchesApi
): RepoBranchesModel => ({
  name: from.name,
  commit: {
    sha: from.commit.sha,
    url: from.commit.url,
  },
});
