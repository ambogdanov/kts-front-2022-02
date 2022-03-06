import React, { ReactElement, useCallback, useMemo, useState } from "react";

import "@styles/styles.scss";

import AlertMessage from "@components/Alert";
import { AlertType } from "@components/Alert/AlertMessage";
import Button from "@components/Button";
import Input from "@components/Input";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import Spinner from "@components/Spinner";
import { GetOrganizationReposListParams } from "@store/GitHubStore/types";
import { RepoItemModel } from "@store/models/gitHub";
import ReposListStore from "@store/ReposListStore";
import log from "@utils/log/Logger";
import { Meta } from "@utils/meta";
import { useLocalStore } from "@utils/useLocalStore";
import { observer } from "mobx-react-lite";
import { Outlet, useNavigate } from "react-router-dom";

import styles from "./RepoSearchPage.module.scss";

const ReposSearchPage: React.FC = (): ReactElement => {
  const [inputValue, setInputValue] = useState<string>("google");
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();
  const per_page = 12;
  const goToBranchDrawer = (repoOwner: string, repo: string) => {
    navigate(`/repos/${repoOwner}/${repo}`);
  };
  const reposListStore = useLocalStore(() => new ReposListStore());

  let isLoading: boolean = reposListStore.meta === Meta.loading;
  let isError: boolean = reposListStore.meta === Meta.error;

  const loadRepos = (params: GetOrganizationReposListParams) => {
    reposListStore.getOrganizationReposList({
      organizationName: params.organizationName,
      page: params.page,
      per_page: params.per_page,
    });
  };

  const searchRepos = (value: string) => {
    setInputValue(value);
  };

  const loadFirstPage = useCallback(() => {
    if (inputValue === searchValue) {
      return;
    } else {
      setSearchValue(inputValue);
      setPage(1);
      loadRepos({ page: 1, per_page, organizationName: inputValue });
    }
  }, [inputValue, searchValue, per_page]);

  const loadNextPage = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (
        !(reposListStore.meta === Meta.loading) &&
        event.currentTarget.scrollHeight - event.currentTarget.scrollTop ===
          event.currentTarget.clientHeight
      ) {
        setPage((page) => page + 1);
        loadRepos({
          page: page + 1,
          per_page,
          organizationName: searchValue,
        });
      }
    },
    [reposListStore.meta, page, searchValue, per_page]
  );

  log(`render RepoPageList`);

  const elements = useMemo(() => {
    log(`Render list items`);
    return reposListStore.list.map((item: RepoItemModel) => {
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
  }, [reposListStore.list]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.search_form}>
          <Input
            value={inputValue}
            placeholder={"Введите название компании"}
            onChange={searchRepos}
          />
          <Button
            onClick={loadFirstPage}
            disabled={reposListStore.meta === Meta.loading}
          >
            <SearchIcon currentColor={"#fff"} />
          </Button>
        </div>
        {isError && (
          <AlertMessage
            message="Организация не найдена"
            description="Попробуйте изменить праметры поиска"
            type={AlertType.info}
          />
        )}
        {!isError && elements}
        {isLoading && <Spinner />}
      </div>
      <Outlet />
    </>
  );
};

export default observer(ReposSearchPage);
