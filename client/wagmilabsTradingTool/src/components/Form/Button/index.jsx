import React from "react";

import "./style.scss";

export const Button = React.memo(({ children, className = "", onClick }) => {
  return (
    <div className={`default-btn ${className}`} onClick={onClick}>
      {children}
    </div>
  );
});
