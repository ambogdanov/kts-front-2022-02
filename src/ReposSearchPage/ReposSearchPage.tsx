import React, { ReactElement, useMemo, useState } from "react";
import "@styles/styles.css";

import Button from "@components/Button";
import Input from "@components/Input";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import GitHubStore from "@gitHubStore";
import { StatusHTTP } from "@shared/store/ApiStore/types";
import { RepoItem } from "@store/GitHubStore/types";

import RepoBranchesDrawer from "../RepoBranchesDrawer";
import log from "../utils/log/Logger";

const gitHubStore = new GitHubStore();

const ReposSearchPage: React.FC = (): ReactElement => {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [search, setSearch] = useState("google");
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [selectedRepo, setSelRepo] = useState<string>("");
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const loadRepos = () => {
    log("Request repo list");
    setLoading(true);
    gitHubStore
      .getOrganizationReposList({
        organizationName: search,
      })
      .then((result) => {
        if (result.status === StatusHTTP.NotFound) {
          alert("Нет такой организации");
          setLoading(false);
        } else {
          setRepos(result.data);
          setLoading(false);
        }
      })
      .catch(() => {
        setError(true);
      });
  };

  const searchRepos = (value: string) => {
    setSearch(value);
  };

  const selectRepo = (name: string) => {
    setSelRepo(name);
  };

  log("Render");

  const elements = useMemo<JSX.Element[]>((): JSX.Element[] => {
    return repos.map((item: RepoItem) => {
      log("Array mapping");
      return (
        <RepoTile
          item={item}
          onClick={() => {
            selectRepo(item.name);
            setDrawerVisible(true);
          }}
          key={item.id}
        />
      );
    });
  }, [repos]);

  let branchDrawer = (
    <RepoBranchesDrawer
      isVisible={isDrawerVisible}
      selectedRepo={selectedRepo}
      width={600}
      orgName={search}
      // onClose={setDrawerVisible(false)}
    />
  );

  return (
    <>
      {isDrawerVisible && branchDrawer}
      <div className="container">
        <div className="search-form">
          <Input
            value={search}
            placeholder={"Введите название компании"}
            onChange={searchRepos}
          />
          <Button onClick={loadRepos} disabled={isLoading}>
            <SearchIcon currentColor={"#fff"} />
          </Button>
        </div>
        {elements}
      </div>
    </>
  );
};

export default ReposSearchPage;
