import React, { ReactElement } from "react";
import "./styles.css";

export type AvatarProps = { readonly src?: string; readonly alt: string };

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
}: AvatarProps): ReactElement => {
  let logo: ReactElement | string = (
    <img src={src} alt={alt} className="img_logo" />
  );
  let logoClassName: string = "repo-item__logo";

  if (!src) {
    logo = alt[0]; // В качестве alt приходит owner.login
    logoClassName += " bgcRed";
  }
  return <div className={logoClassName}>{logo}</div>;
};

export default React.memo(Avatar);
