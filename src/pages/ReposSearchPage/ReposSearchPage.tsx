import React, { ReactElement, useCallback, useMemo, useState } from "react";
import "@styles/styles.scss";

import Button from "@components/Button";
import Input from "@components/Input";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import Spinner from "@components/Spinner";
import GitHubStore from "@gitHubStore";
import { StatusHTTP } from "@shared/store/ApiStore/types";
import { RepoItem } from "@store/GitHubStore/types";
import log from "@utils/log/Logger";

import RepoBranchesDrawer from "./components/RepoBranchesDrawer";
import styles from "./RepoSearchPage.module.scss";

const gitHubStore = new GitHubStore();

const ReposSearchPage: React.FC = (): ReactElement => {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [search, setSearch] = useState<string>("google");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [selectedRepo, setSelRepo] = useState<string>("");
  const [isDrawerVisible, setDrawerVisible] = useState<boolean>(false);

  const loadRepos = useCallback(() => {
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
    log("GET Repos from API");
  }, []);

  const searchRepos = (value: string) => {
    setSearch(value);
  };

  const selectRepo = (name: string) => {
    setSelRepo(name);
  };

  const elements = useMemo<JSX.Element[]>((): JSX.Element[] => {
    return repos.map((item: RepoItem) => {
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

  const branchDrawer = (
    <RepoBranchesDrawer
      isVisible={isDrawerVisible}
      selectedRepo={selectedRepo}
      width={600}
      orgName={search}
      onClose={() => setDrawerVisible(false)}
    />
  );

  return (
    <>
      {isDrawerVisible && branchDrawer}
      <div className={styles.container}>
        <div className={styles.search_form}>
          <Input
            value={search}
            placeholder={"Введите название компании"}
            onChange={searchRepos}
          />
          <Button onClick={loadRepos} disabled={isLoading}>
            <SearchIcon currentColor={"#fff"} />
          </Button>
        </div>
        {isLoading && <Spinner />}
        {!isLoading && elements}
      </div>
    </>
  );
};

export default ReposSearchPage;
export { gitHubStore };
