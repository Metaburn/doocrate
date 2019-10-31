import React, {Component} from "react";
import PropTypes from "prop-types";
import i18n from "src/i18n";

import "./meEmptyPlaceholder.css";
import Icon from "../../components/icon/icon";
import {NavLink} from "react-router-dom";

class MeEmptyPlaceholder extends Component {

  render() {
    const { projectUrl } = this.props;

    return (
      <div className={"me-empty-placeholder"}>
        <h3>
          Looking what to do next?
        </h3>

        <div className={"items-row"} >
          <Icon name={"assignment"}/>
          &nbsp;
          <button className={`button-as-link`} onClick={() => {}}>
            <NavLink to={`/${projectUrl}/task/new-task`}>Create yourself a task</NavLink>
          </button>
          <span>&nbsp;-&nbsp;Feeling creative? create a task</span>
        </div>
        <div className={"items-row"} >
          <Icon name={"assignment_ind"}/>
          &nbsp;
          <button className={`button-as-link`} onClick={() => {}}>
            <NavLink to={`/${projectUrl}/task/search-task`}>Search yourself a free task</NavLink>
          </button>
          <span>&nbsp;-&nbsp;See what tasks exists</span>
        </div>

        <div className={"items-row"} >
          <Icon name={"face"}/>
          &nbsp;
          <button className={`button-as-link`} onClick={() => {}}>
            Search for humans
          </button>
          <span>&nbsp;-&nbsp;Or human's tasks</span>
        </div>

        <div className={"items-row"} >
          <Icon name={"label"}/>
          &nbsp;
          <button className={`button-as-link`} onClick={() => {}}>
            Filter tasks by tags
          </button>
          <span>&nbsp;-&nbsp;Popular or casual tags</span>
        </div>

      </div>
    )
  }
}

MeEmptyPlaceholder.propTypes = {
  projectUrl: PropTypes.string,
};

export default MeEmptyPlaceholder;
