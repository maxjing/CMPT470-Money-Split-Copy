import React from "react";

const Alert = (props) => (
  <div>
    <div className={`alert alert-${props.type} mt-3 `}>
      <strong> {props.des}</strong>
    </div>
  </div>
);

export default Alert;
