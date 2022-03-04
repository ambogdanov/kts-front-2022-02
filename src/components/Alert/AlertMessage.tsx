import React from "react";

import { Alert } from "antd";

export enum AlertType {
  success = "success",
  info = "info",
  warning = "warning",
  error = "error",
}

export type AlertProps = {
  message: string;
  description: string;
  type: AlertType;
};

const AlertMessage: React.FC<AlertProps> = ({
  message,
  description,
  type,
}: AlertProps) => {
  return <Alert message={message} description={description} type={type} />;
};

export default React.memo(AlertMessage);
