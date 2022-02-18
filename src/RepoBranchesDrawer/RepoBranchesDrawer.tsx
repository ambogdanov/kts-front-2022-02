import React, { useEffect, useMemo, useState } from "react";

import GitHubStore from "@gitHubStore";
import { Drawer } from "antd";

import log from "../utils/log/Logger";

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

const gitHubStore = new GitHubStore();

const RepoBranchesDrawer = ({
  selectedRepo,
  orgName,
  isVisible,
  width,
}: RepoBranchesDrawerProps) => {
  const [visible, setVisible] = useState(true);
  const [branches, setBranches] = useState<[]>([]);

  const onClose = () => {
    setVisible(false);
    setBranches([]);
  };

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
    setVisible(true);
  }, [selectedRepo]);

  let elements = useMemo<JSX.Element[]>((): JSX.Element[] => {
    return branches.map((item: RepoBranches) => {
      log("Branches mapping");
      return <li key={item.commit.sha}>{item.name}</li>;
    });
  }, [branches]);

  return (
    <>
      <Drawer
        title={`${selectedRepo} branches:`}
        placement="right"
        onClose={onClose}
        visible={visible}
        width={width}
      >
        <ul>{elements}</ul>
      </Drawer>
    </>
  );
};

export default RepoBranchesDrawer;
