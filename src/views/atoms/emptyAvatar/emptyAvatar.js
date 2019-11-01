import React from "react";
import PropTypes from "prop-types";
import i18n from "src/i18n";

import emptyAvatar from "./empty-avatar.svg";

const EmptyAvatar = ({ alt, isShowText=false }) => (
    <div className={`empty-avatar-container lang-${i18n.language}`}>
      <img src={emptyAvatar} className={"avatar"} alt={alt}/>
      { isShowText &&
        <span>{i18n.t("task.no-assignee")}</span>
      }
    </div>
);

EmptyAvatar.propTypes = {
  alt: PropTypes.string,
  isShowText: PropTypes.bool
};

export default EmptyAvatar;
