import React from "react";

export type AvatarProps = { src?: string; alt: string };

const Avatar: React.FC<AvatarProps> = ({ src, alt }: AvatarProps) => {
  return <img src={src} alt={alt} className="img_logo" />;
};

export default Avatar;
