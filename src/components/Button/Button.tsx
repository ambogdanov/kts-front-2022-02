import React from "react";

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
  return (
    <button
      className="search-form__button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;