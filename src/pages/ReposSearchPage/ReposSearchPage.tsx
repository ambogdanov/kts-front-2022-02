//TODO 1. DONE Реализован роутинг
//TODO 2. DONE Изменена логика получения выбранного репозитория внутри Drawer или страницы отдельного репозитория
//TODO 3. Список репозиториев находится внутри React.Context
//TODO 4. DONE Стили переписаны на css-modules с использованием scss, переменные и миксины вынесены в отдельный файл.
//TODO 5. Дополнительно: реализован "бесконечный скрол".
//TODO 6. Убрать Undefined у GetReposBranchesListParams

import React, { ReactElement, useCallback, useMemo, useState } from "react";

import "@styles/styles.scss";

import AlertMessage from "@components/Alert";
import Button from "@components/Button";
import Input from "@components/Input";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import Spinner from "@components/Spinner";
import GitHubStore from "@gitHubStore";
import { StatusHTTP } from "@shared/store/ApiStore/types";
import { RepoItem } from "@store/GitHubStore/types";
import log from "@utils/log/Logger";
import { Outlet, useNavigate } from "react-router-dom";

import RepoBranchesDrawer from "./components/RepoBranchesDrawer";
import styles from "./RepoSearchPage.module.scss";

const gitHubStore = new GitHubStore();

const ReposSearchPage: React.FC = (): ReactElement => {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [search, setSearch] = useState<string>("google");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  //const [selectedRepo, setSelRepo] = useState<string>("");
  const [isDrawerVisible, setDrawerVisible] = useState<boolean>(false);
  let navigate = useNavigate();
  function handleClick(repoOwner: string, repo: string) {
    navigate(`/repos/${repoOwner}/${repo}`);
  }
  let page = 1;
  const per_page = 12;

  const loadRepos = useCallback(() => {
    setLoading(true);
    gitHubStore
      .getOrganizationReposList({
        organizationName: search,
        page: page,
        per_page: per_page,
      })
      .then((result) => {
        if (result.status === StatusHTTP.NotFound) {
          setError(true);
          setLoading(false);
        } else {
          setError(false);
          setRepos(result.data);
          setLoading(false);
        }
      })
      .catch(() => {
        setError(true);
      });
    log(`GET Repos from API, page: ${page}`);
  }, [search]);

  const searchRepos = (value: string) => {
    setSearch(value);
  };

  // const selectRepo = (name: string) => {
  //   setSelRepo(name);
  // };

  const elements = useMemo(() => {
    return repos.map((item: RepoItem) => {
      return (
        <RepoTile
          item={item}
          key={item.id}
          onClick={() => {
            // selectRepo(item.name);
            setDrawerVisible(true);
            handleClick(item.owner.login, item.name);
          }}
        />
      );
    });
  }, [repos]);

  const branchDrawer = (
    <RepoBranchesDrawer isVisible={isDrawerVisible} width={600} />
  );

  return (
    <>
      {/*{isDrawerVisible && branchDrawer}*/}
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
        {isError && (
          <AlertMessage
            message={"Организация не найдена"}
            description={"Попробуйте изменить праметры поиска"}
            type={"info"}
          />
        )}
        {isLoading && <Spinner />}
        {!isLoading && !isError && elements}
      </div>
      <Outlet />
    </>
  );
};

export default ReposSearchPage;
export { gitHubStore };
