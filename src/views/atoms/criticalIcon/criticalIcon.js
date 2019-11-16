import React from "react";
import PropTypes from "prop-types";
import Icon from "../icon/icon";
import i18n from "src/i18n";

import "./criticalIcon.css"

const CriticalIcon = ({ showText }) => (
  <span className={`critical-icon lang-${i18n.language}`}>
    {showText === true && <span className={"critical-text"}>{i18n.t("task.critical")}</span>}
    <Icon name="warning" className="header-icon grow"/>
  </span>
);

CriticalIcon.prototype = {
  showText: PropTypes.bool
};

export default CriticalIcon;

