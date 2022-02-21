import React from "react";

import log from "@utils/log/Logger";

import styles from "./Button.module.scss";

export type ButtonProps = {
  onClick: (e: React.MouseEvent) => void;
  disabled: boolean;
  children: React.ReactNode;
};
const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled,
  children,
}: ButtonProps) => {
  log(styles.button);
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default React.memo(Button);
