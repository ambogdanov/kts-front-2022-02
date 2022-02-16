import React, { ReactElement, useState } from "react";
import "../layouts/styles.css";

import Button from "@components/Button";
import Input from "@components/Input";
import RepoTile from "@components/RepoTile";
import SearchIcon from "@components/SearchIcon";
import GitHubStore from "@gitHubStore";
import { StatusHTTP } from "@shared/store/ApiStore/types";
import { RepoItem } from "@store/GitHubStore/types";

import log from "../Logger/Logger";

const gitHubStore = new GitHubStore();

const ReposSearchPage: React.FC = (): ReactElement => {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [search, setSearch] = useState("ktsstudio");
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const loadRepos = () => {
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

  log("Render");

  const elements = repos.map((item: RepoItem) => {
    log("Array mapping");
    return <RepoTile item={item} onClick={() => {}} key={item.id} />;
  });

  return (
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
  );
};

export default ReposSearchPage;
