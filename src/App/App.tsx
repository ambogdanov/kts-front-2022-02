import React, { createContext } from "react";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import ReposSearchPage from "../pages/ReposSearchPage";
import { RepoBranchesDrawer } from "../pages/ReposSearchPage/components/RepoBranchesDrawer/RepoBranchesDrawer";

// type ReposContext = { list: RepoItem[]; isLoading: boolean; load: () => void };

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/repos" element={<ReposSearchPage />}>
            <Route
              path=":organizationName/:repoName"
              element={<RepoBranchesDrawer width={600} isVisible={true} />}
            />
          </Route>

          <Route path={"*"} element={<Navigate to="/repos" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
