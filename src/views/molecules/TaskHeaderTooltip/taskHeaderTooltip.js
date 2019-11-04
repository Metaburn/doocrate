import React, {Component} from "react";
import PropTypes from "prop-types";
import Button from "../../components/button/button";
import Icon from "../../atoms/icon/icon";
import i18n from "src/i18n";
import ToolTip from "react-portal-tooltip";

import "./taskHeaderTooltip.css";

class TaskHeaderTooltip extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTooltipActive: false
    }
  }

  render() {
    let tooltipStyle = {
      style: {
        "min-width": "190px",
        "zIndex": "2500"
      }, arrowStyle: {
        // This library doesn't compile without this feature
      }
    };

    const { isIconDoneUndone, isShowMarkAsDoneButton,
      isShowDeleteButton, isShowUnassignButton} = this.props;

    return (
      <div id={"task-header-tooltip-item"}
           className={"task-header-tooltip"}
           onMouseEnter={() => this.setState({isTooltipActive: true})}
           onMouseLeave={() => this.setState({isTooltipActive: false})}>
        <Icon name="more_horiz"/>
        <ToolTip active={this.state.isTooltipActive}
                 position={"bottom"}
                 parent={"#task-header-tooltip-item"}
                 style={tooltipStyle}>
          <div className={`task-header-tooltip-container dir-${i18n.t("lang-float")}`}>
            { isShowUnassignButton &&
            <Button
              className="button button-small action-button"
              onClick={()=> {
                if (!window.confirm(i18n.t("task.sure-unassign"))) {
                  return;
                }
                this.props.onUnassignTask()
              }}
              type="button">
              {i18n.t("task.remove-responsibility")}
              <Icon name="face" className="grow delete"/>
            </Button>
            }

            { isShowMarkAsDoneButton &&
              <div>
                <Button
                  className="button button-small action-button"
                  onClick={()=> { this.props.onSetAsDoneUndone() }}
                  type="button">
                  { isIconDoneUndone ? i18n.t("task.mark-uncomplete") : i18n.t("task.mark-complete")}
                  <Icon name="done" className="grow delete"/>
                  </Button>
              </div>
            }

            { isShowDeleteButton &&
            <Button
              className="button button-small action-button"
              onClick={() => {
                if (!window.confirm(i18n.t("task.sure-delete"))) {
                  return;
                }
                this.props.onDeleteTask();
              }}
              type="button">
              {i18n.t("task.delete")}
              <Icon name="delete" className="grow delete"/>
            </Button>
            }

          </div>
        </ToolTip>
      </div>
    );
  }
}

TaskHeaderTooltip.propTypes = {
  isIconDoneUndone: PropTypes.bool.isRequired,
  isShowMarkAsDoneButton: PropTypes.bool.isRequired,
  onSetAsDoneUndone: PropTypes.func.isRequired,
  isShowDeleteButton: PropTypes.bool.isRequired,
  isShowUnassignButton: PropTypes.bool.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onUnassignTask: PropTypes.func.isRequired,
};

export default TaskHeaderTooltip;
