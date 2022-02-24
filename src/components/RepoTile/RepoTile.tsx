import React, { ReactElement } from "react";
import "./styles.css";

import Avatar from "@components/Avatar";
import StarIcon from "@components/StarIcon";
import { RepoItem } from "@store/GitHubStore/types";

import log from "../../utils/log/Logger";

export type RepoTileProps = {
  item: RepoItem;
  onClick: (e: React.MouseEvent) => void;
};

const RepoTile: React.FC<RepoTileProps> = ({
  item,
  onClick,
}: RepoTileProps): ReactElement => {
  const { name, owner, stargazers_count, updated_at } = item;
  const date = new Date(updated_at)
    .toUTCString()
    .split(" ")
    .slice(1, 3)
    .join(" ");

  log("Render Repotile");
  return (
    <div className="repo-item" onClick={onClick}>
      <Avatar src={owner.avatar_url} alt={owner.login} />
      <div className="repo-tem__title">
        <p className="repo-item__name">{name}</p>
        <a href={owner.html_url} className="repo-item__org_name">
          {owner.login}
        </a>
        <div className="repo-item__bottom">
          <StarIcon currentColor={"#ff5555"} className={"repo-item__star"} />
          <div className="repo-item__like">{stargazers_count}</div>
          <div className="repo-item__update"> Updated {date}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RepoTile);
