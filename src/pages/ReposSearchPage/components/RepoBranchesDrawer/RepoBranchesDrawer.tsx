import React, { useEffect, useMemo, useState } from "react";

import log from "@utils/log/Logger";
import { Drawer } from "antd";

import { gitHubStore } from "../../ReposSearchPage";

export type RepoBranchesDrawerProps = {
  selectedRepo: string;
  orgName: string;
  isVisible: boolean;
  width: number;
  onClose?: () => void;
};

type RepoBranches = {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
};

const RepoBranchesDrawer: React.FC<RepoBranchesDrawerProps> = ({
  selectedRepo,
  orgName,
  isVisible,
  width,
  onClose,
}: RepoBranchesDrawerProps) => {
  const [branches, setBranches] = useState<[]>([]);

  useEffect(() => {
    gitHubStore
      .getReposBranchesList({
        organizationName: orgName,
        repoName: selectedRepo,
      })
      .then((result) => {
        log(result.data);
        setBranches(result.data);
      });
  }, []);

  const elements = useMemo(() => {
    return branches.map((item: RepoBranches) => {
      log("Branches mapping");
      return <li key={item.commit.sha}>{item.name}</li>;
    });
  }, [branches]);

  return (
    <Drawer
      title={`${selectedRepo} branches:`}
      placement="right"
      onClose={onClose}
      visible={isVisible}
      width={width}
    >
      <ul>{elements}</ul>
    </Drawer>
  );
};

export default React.memo(RepoBranchesDrawer);
