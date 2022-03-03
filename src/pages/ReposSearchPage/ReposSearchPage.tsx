import React, { ReactElement, useMemo, useState } from "react";

import "@styles/styles.scss";

import { useReposContext } from "@app/App";
import AlertMessage from "@components/Alert";
import Button from "@components/Button";
import Input from "@components/Input";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import Spinner from "@components/Spinner";
import {
  GetOrganizationReposListParams,
  RepoItem,
} from "@store/GitHubStore/types";
import log from "@utils/log/Logger";
import { Outlet, useNavigate } from "react-router-dom";

import styles from "./RepoSearchPage.module.scss";

const ReposSearchPage: React.FC = (): ReactElement => {
  const { load, isLoading, list, isError } = useReposContext();
  const [inputValue, setInputValue] = useState<string>("google");
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>("");

  const navigate = useNavigate();
  const per_page = 12;

  const goToBranchDrawer = (repoOwner: string, repo: string) => {
    navigate(`/repos/${repoOwner}/${repo}`);
  };

  const loadRepos = (params: GetOrganizationReposListParams) => {
    load({
      organizationName: params.organizationName,
      page: params.page,
      per_page: params.per_page,
    });
  };

  const searchRepos = (value: string) => {
    setInputValue(value);
  };

  const elements = useMemo(() => {
    return list.map((item: RepoItem) => {
      return (
        <RepoTile
          item={item}
          key={item.id}
          onClick={() => {
            goToBranchDrawer(item.owner.login, item.name);
          }}
        />
      );
    });
  }, [list]);

  const loadFirstPage = () => {
    if (inputValue === searchValue) {
      return;
    } else {
      setSearchValue(inputValue);
      setPage(1);
      loadRepos({ page: 1, per_page, organizationName: inputValue });
    }
  };
  const loadNextPage = (event: React.UIEvent<HTMLDivElement>) => {
    if (
      !isLoading &&
      event.currentTarget.scrollHeight - event.currentTarget.scrollTop ===
        event.currentTarget.clientHeight
    ) {
      setPage((page) => page + 1);
      loadRepos({
        page: page + 1,
        per_page,
        organizationName: inputValue,
      });
    }
  };

  return (
    <>
      <div className={styles.container} onScroll={loadNextPage}>
        <div className={styles.search_form}>
          <Input
            value={inputValue}
            placeholder={"Введите название компании"}
            onChange={searchRepos}
          />
          <Button onClick={loadFirstPage} disabled={isLoading}>
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
        {!isError && elements}
        {isLoading && <Spinner />}
      </div>
      <Outlet />
    </>
  );
};

export default ReposSearchPage;
