import React from "react";

import ReposSearchPage from "@pages/ReposSearchPage";
import { RepoBranchesDrawer } from "@pages/ReposSearchPage/components/RepoBranchesDrawer/RepoBranchesDrawer";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/repos" element={<ReposSearchPage />}>
            <Route
              path="/repos/:organizationName/:repoName"
              element={<RepoBranchesDrawer width={600} isVisible={true} />}
            />
          </Route>
          <Route path={"*"} element={<Navigate to="/repos" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
