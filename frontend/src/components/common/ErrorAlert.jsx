import React from "react";

const ErrorAlert = ({ error }) => {
  if (!error) return null;
  return <div className="alert">{error}</div>;
};

export default ErrorAlert;