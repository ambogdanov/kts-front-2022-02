import React, { ReactElement, useCallback, useMemo, useState } from "react";

import "@styles/styles.scss";

import AlertMessage from "@components/Alert";
import { AlertType } from "@components/Alert/AlertMessage";
import Button from "@components/Button";
import Input from "@components/Input";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import Spinner from "@components/Spinner";
import { RepoItemModel } from "@store/models/gitHub";
import ReposListStore from "@store/ReposListStore";
import log from "@utils/log/Logger";
import { Meta } from "@utils/meta";
import { useLocalStore } from "@utils/useLocalStore";
import { observer } from "mobx-react-lite";
import { Outlet, useNavigate } from "react-router-dom";

import styles from "./RepoSearchPage.module.scss";

const ReposSearchPage: React.FC = (): ReactElement => {
  const navigate = useNavigate();
  const goToBranchDrawer = (repoOwner: string, repo: string) => {
    navigate(`/repos/${repoOwner}/${repo}`);
  };
  const reposListStore = useLocalStore(() => new ReposListStore());

  let isLoading: boolean = reposListStore.meta === Meta.loading;
  let isError: boolean = reposListStore.meta === Meta.error;

  // TODO Реализовать бесконечный скролл через стор
  // const loadNextPage = useCallback(
  //   (event: React.UIEvent<HTMLDivElement>) => {
  //     if (
  //       !(reposListStore.meta === Meta.loading) &&
  //       event.currentTarget.scrollHeight - event.currentTarget.scrollTop ===
  //         event.currentTarget.clientHeight
  //     ) {
  //       setPage((page) => page + 1);
  //       loadRepos({
  //         page: page + 1,
  //         per_page,
  //         organizationName: searchValue,
  //       });
  //     }
  //   },
  //   [reposListStore.meta, page, searchValue, per_page]
  // );

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
            value={reposListStore.inputValue}
            placeholder={"Введите название компании"}
            onChange={reposListStore.setInputValue}
          />
          <Button onClick={reposListStore.loadFirstPage} disabled={isLoading}>
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
