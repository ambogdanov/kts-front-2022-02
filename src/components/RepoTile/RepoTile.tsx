import React, { ReactElement } from "react";

import Avatar from "@components/Avatar";
import StarIcon from "@components/StarIcon";
import { RepoItem } from "@store/GitHubStore/types";

import log from "../../utils/log/Logger";
import styles from "./Repotile.module.scss";

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

  return (
    <div className={styles.item} onClick={onClick}>
      <Avatar src={owner.avatar_url} alt={owner.login} />
      <div className={styles.item__title}>
        <p className={styles.item__name}>{name}</p>
        <a href={owner.html_url} className={styles.item__org_name}>
          {owner.login}
        </a>
        <div className={styles.item__bottom}>
          <StarIcon currentColor={"#ff5555"} className={styles.item__star} />
          <div className={styles.item__like}>{stargazers_count}</div>
          <div className={styles.item__update}> Updated {date}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RepoTile);
