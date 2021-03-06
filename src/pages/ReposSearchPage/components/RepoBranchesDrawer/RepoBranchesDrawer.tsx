import React, { useEffect, useState } from "react";

import { GetReposBranchesListParams } from "@store/GitHubStore/types";
import { RepoBranchesModel } from "@store/models/gitHub/repoBranches";
import RepoBranchesStore from "@store/RepoBranchesStore";
import { useLocalStore } from "@utils/useLocalStore";
import { Drawer } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useParams, useNavigate } from "react-router-dom";

export type RepoBranchesDrawerProps = {
  isVisible: boolean;
  width?: number;
  onClose?: () => void;
};

export const RepoBranchesDrawer: React.FC<RepoBranchesDrawerProps> = ({
  isVisible,
  width,
  onClose,
}: RepoBranchesDrawerProps) => {
  const repoBranchesStore = useLocalStore(() => new RepoBranchesStore());
  const [visible, setVisible] = useState<boolean>(false);
  const { organizationName, repoName } =
    useParams<GetReposBranchesListParams>();
  let navigate = useNavigate();

  useEffect(() => {
    repoBranchesStore
      .getReposBranchesList({ organizationName, repoName })
      .then(() => {
        setVisible(isVisible);
      });
  }, [organizationName, repoName, repoBranchesStore]);

  const items = () => {
    return toJS(repoBranchesStore.list).map((item: RepoBranchesModel) => {
      return <li key={item.commit.sha}>{item.name}</li>;
    });
  };

  const elements = items();

  return (
    <Drawer
      title={`${repoName} branches:`}
      placement="right"
      onClose={() => navigate("/repos", { replace: true })}
      visible={visible}
      width={width}
    >
      <ul>{elements}</ul>
    </Drawer>
  );
};

export default observer(RepoBranchesDrawer);
