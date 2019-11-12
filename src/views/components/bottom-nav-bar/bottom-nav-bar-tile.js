import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Icon from "../../atoms/icon";

export default ({ icon, path, active, dataTour }) => {
  const activeClass = active ? "active" : "";
  return (
    <Fragment>
      <Link
        className={`bottom-nav-tile ${activeClass}`}
        to={path}
        data-tour={dataTour}
      >
        <Icon className={"bottom-nav-icon"} name={icon} />
      </Link>
    </Fragment>
  );
};
