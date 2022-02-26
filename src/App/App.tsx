import React, { createContext, useContext, useState } from "react";

import GitHubStore from "@gitHubStore";
import ReposSearchPage from "@pages/ReposSearchPage";
import { RepoBranchesDrawer } from "@pages/ReposSearchPage/components/RepoBranchesDrawer/RepoBranchesDrawer";
import { StatusHTTP } from "@shared/store/ApiStore/types";
import {
  GetOrganizationReposListParams,
  RepoItem,
} from "@store/GitHubStore/types";
import log from "@utils/log/Logger";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

type ReposContextT = {
  list: RepoItem[];
  isLoading: boolean;
  isError: boolean;
  load: (params: GetOrganizationReposListParams) => void;
};

const ReposContext = createContext<ReposContextT>({
  list: [],
  isLoading: false,
  isError: false,
  load: () => {},
});
export const useReposContext = () => useContext(ReposContext);
const Provider = ReposContext.Provider;
const gitHubStore = new GitHubStore();

function App() {
  const [list, setList] = useState<RepoItem[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);

  const loadRepos = ({
    page,
    per_page,
    organizationName,
  }: GetOrganizationReposListParams) => {
    setLoading(true);
    gitHubStore
      .getOrganizationReposList({
        organizationName: organizationName,
        page: page,
        per_page: per_page,
      })
      .then((result) => {
        if (result.status === StatusHTTP.NotFound) {
          setError(true);
          setLoading(false);
        } else {
          setError(false);
          setList((list) => [...list, ...result.data]);
          setLoading(false);
        }
      })
      .catch(() => {
        setError(true);
      });
    log(`GET Repos of ${organizationName} from API, page: ${page}`);
  };
  return (
    <Provider value={{ list, isLoading, isError, load: loadRepos }}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/repos" element={<ReposSearchPage />}>
              <Route
                path=":organizationName/:repoName"
                element={<RepoBranchesDrawer width={600} isVisible={true} />}
              />
            </Route>

            <Route path={"*"} element={<Navigate to="/repos" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
export { gitHubStore };
