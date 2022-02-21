import React, { ReactElement } from "react";

import styles from "./Avatar.module.scss";

export type AvatarProps = { readonly src?: string; readonly alt: string };

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
}: AvatarProps): ReactElement => {
  let logo: ReactElement | string = (
    <img src={src} alt={alt} className={styles.img_logo} />
  );
  let logoClassName: string = `${styles.item__logo}`;

  if (!src) {
    logo = alt[0]; // В качестве alt приходит owner.login
    logoClassName += ` ${styles.bgcRed}`;
  }
  return <div className={logoClassName}>{logo}</div>;
};

export default React.memo(Avatar);
