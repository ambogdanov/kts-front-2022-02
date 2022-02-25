import React from "react";

import { Alert } from "antd";

export type AlertProps = {
  message: string;
  description: string;
  type: "success" | "info" | "warning" | "error";
};

const AlertMessage: React.FC<AlertProps> = ({
  message,
  description,
  type,
}: AlertProps) => {
  return <Alert message={message} description={description} type={type} />;
};

export default AlertMessage;
