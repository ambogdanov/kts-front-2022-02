import React, { ReactElement, useCallback, useMemo } from "react";

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
import { Meta } from "@utils/meta";
import { useLocalStore } from "@utils/useLocalStore";
import { observer } from "mobx-react-lite";
import { Outlet, useNavigate } from "react-router-dom";

import styles from "./RepoSearchPage.module.scss";

const ReposSearchPage: React.FC = (): ReactElement => {
  const navigate = useNavigate();

  const goToBranchDrawer = useCallback(
    (repoOwner: string, repo: string) => {
      navigate(`/repos/${repoOwner}/${repo}`);
    },
    [navigate]
  );

  const reposListStore = useLocalStore(() => new ReposListStore());

  let isLoading: boolean = reposListStore.meta === Meta.loading;
  let isError: boolean = reposListStore.meta === Meta.error;

  const loadNextPage = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      if (
        !isLoading &&
        event.currentTarget.scrollHeight - event.currentTarget.scrollTop ===
          event.currentTarget.clientHeight
      ) {
        reposListStore.loadNextPage();
      }
    },
    [isLoading, reposListStore.loadNextPage]
  );

  const elements = useMemo(() => {
    return reposListStore.list.map((item: RepoItemModel) => {
      return <RepoTile item={item} key={item.id} onClick={goToBranchDrawer} />;
    });
  }, [reposListStore.list]);

  return (
    <>
      <div className={styles.container} onScroll={loadNextPage}>
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
