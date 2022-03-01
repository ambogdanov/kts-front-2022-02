import React, { useEffect, useMemo, useState } from "react";

import { gitHubStore } from "@app/App";
import { StatusHTTP } from "@shared/store/ApiStore/types";
import { GetReposBranchesListParams } from "@store/GitHubStore/types";
import log from "@utils/log/Logger";
import { Drawer } from "antd";
import { useParams, useNavigate } from "react-router-dom";

export type RepoBranchesDrawerProps = {
  isVisible: boolean;
  width?: number;
  onClose?: () => void;
};

type RepoBranches = {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
};

export const RepoBranchesDrawer: React.FC<RepoBranchesDrawerProps> = ({
  isVisible,
  width,
  onClose,
}: RepoBranchesDrawerProps) => {
  const [branches, setBranches] = useState<[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const { organizationName, repoName } =
    useParams<GetReposBranchesListParams>();
  let navigate = useNavigate();
  const handleClick = () => {
    navigate("/repos", { replace: true });
  };
  useEffect(() => {
    gitHubStore
      .getReposBranchesList({ organizationName, repoName })
      .then((result) => {
        if (result.status === StatusHTTP.NotFound) {
          handleClick();
        } else {
          setBranches(result.data);
          setVisible(isVisible);
        }
      });
  }, [repoName, isVisible]);

  const elements = useMemo(() => {
    return branches.map((item: RepoBranches) => {
      log("Branches mapping");
      return <li key={item.commit.sha}>{item.name}</li>;
    });
  }, [branches]);

  return (
    <Drawer
      title={`${repoName} branches:`}
      placement="right"
      onClose={handleClick}
      visible={visible}
      width={width}
    >
      <ul>{elements}</ul>
    </Drawer>
  );
};

export default React.memo(RepoBranchesDrawer);
