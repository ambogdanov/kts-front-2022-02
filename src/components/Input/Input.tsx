import React from "react";

import styles from "./Input.module.scss";

export type InputProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  onChange,
}: InputProps) => {
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value);
  };
  return (
    <>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

export default React.memo(Input);
