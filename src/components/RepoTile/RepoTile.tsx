import React, { ReactElement } from "react";

import Avatar from "@components/Avatar";
import StarIcon from "@components/StarIcon";
import { RepoItemModel } from "@store/models/gitHub";

import styles from "./Repotile.module.scss";

export type RepoTileProps = {
  item: RepoItemModel;
  onClick: (repoOwner: string, repo: string) => void;
};

const RepoTile: React.FC<RepoTileProps> = ({
  item,
  onClick,
}: RepoTileProps): ReactElement => {
  const { name, owner, stargazersCount, updatedAt } = item;

  return (
    <div className={styles.item} onClick={(e) => onClick(owner.login, name)}>
      <Avatar src={owner.avatarUrl} alt={owner.login} />
      <div className={styles.item__title}>
        <p className={styles.item__name}>{name}</p>
        <a href={owner.htmlUrl} className={styles.item__org_name}>
          {owner.login}
        </a>
        <div className={styles.item__bottom}>
          <div className={styles.item__like}>
            <StarIcon currentColor={"#ff5555"} />
            <p>{stargazersCount}</p>
          </div>
          <div className={styles.item__update}> Updated {updatedAt}</div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RepoTile);
