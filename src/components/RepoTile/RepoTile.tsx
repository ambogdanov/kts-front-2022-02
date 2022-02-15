import React from "react";

import Avatar from "@components/Avatar/Avatar";
import StarIcon from "@components/StarIcon";
import { RepoItem } from "@store/GitHubStore/types";

export type RepoTileProps = {
  item: RepoItem;
  onClick: (e: React.MouseEvent) => void;
};

const RepoTile: React.FC<RepoTileProps> = ({
  item,
  onClick,
}: RepoTileProps): JSX.Element => {
  const { name, owner, stargazers_count, updated_at } = item;
  const date = new Date(updated_at)
    .toUTCString()
    .split(" ")
    .slice(1, 3)
    .join(" ");
  const logo = owner.avatar_url ? (
    <Avatar src={owner.avatar_url} alt={owner.login} />
  ) : (
    owner.login[0]
  );

  return (
    <div className="repo-item" onClick={onClick}>
      <div className="repo-item__logo">{logo}</div>
      <div className="repo-tem__title">
        <p className="repo-item__name">{name}</p>
        <a href={owner.html_url} className="repo-item__org_name">
          {owner.login}
        </a>
        <div className="repo-item__bottom">
          <StarIcon currentColor={"#ff5555"} />
          <div className="repo-item__like">{stargazers_count}</div>
          <div className="repo-item__update"> Updated {date}</div>
        </div>
      </div>
    </div>
  );
};

export default RepoTile;
