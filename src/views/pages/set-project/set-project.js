import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Textbox } from "react-inputs-validation";
import { I18n } from "react-i18next";
import { projectActions } from "src/projects";
import { notificationActions } from "../../../notification";
import TagsInput from "react-tagsinput";
import i18n from "src/i18n.js";
import { appConfig } from "../../../config/app-config";
import { firebaseConfig } from "../../../firebase/config";
import Select from "react-select";
import CollapsibleContainer from "../../atoms/collapsibleContainer/collapsibleContainer";

import "./set-project.css";

class SetProject extends Component {
  constructor() {
    super(...arguments);

    this.state = {
      isExisting: false, //Whether or not we are editing an existing project
      name: "",
      projectUrl: "",
      validations: {},
      isPublic: true,
      type0: "",
      type1: "",
      type2: "",
      type3: "",
      type4: "",
      popularTags: [],
      extraFields: [],
      defaultLanguages: [],
      language: "",
      canCreateTask: true,
      canAssignTask: true,
      domainUrl: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
    this.handleExtraFieldsChange = this.handleExtraFieldsChange.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);

    this.isValid = this.isValid.bind(this);
  }

  componentWillMount() {
    this.props.selectProjectFromUrl();
    this.updateStateByProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateByProps(nextProps);
  }

  updateStateByProps(props) {
    //TODO - this should be set in a more global place
    const defaultLanguages = [
      { value: "en", label: i18n.t("nav.en-lang") },
      { value: "he", label: i18n.t("nav.he-lang") }
    ];

    if (
      props.match != null &&
      props.match.params.projectUrl &&
      props.selectedProject
    ) {
      // Existing project
      const projectUrl = props.match.params.projectUrl;
      let existingProject = props.selectedProject;
      if (!existingProject) {
        return;
      }

      const {
        name,
        taskTypes,
        creator,
        extraFields,
        language,
        canCreateTask,
        canAssignTask,
        domainUrl
      } = existingProject;

      let { popularTags, isPublic } = existingProject;

      popularTags = this.fromTagObject(popularTags);

      let type0, type1, type2, type3, type4;
      if (taskTypes && taskTypes.length > 4) {
        type0 = taskTypes[0];
        type1 = taskTypes[1];
        type2 = taskTypes[2];
        type3 = taskTypes[3];
        type4 = taskTypes[4];
      }

      // Only allow edit if the user is the creator of this project
      if (!creator.id === props.auth.id) {
        return;
      }

      if (isPublic === undefined) {
        isPublic = true;
      }

      this.setState({
        isExisting: true,
        projectUrl: projectUrl,
        popularTags: popularTags || [],
        extraFields: extraFields || [],
        name: name || "",
        canCreateTask: canCreateTask,
        canAssignTask: canAssignTask,
        domainUrl: domainUrl,
        defaultLanguages: defaultLanguages,
        isPublic: isPublic,
        language: language,
        type0: type0 || "",
        type1: type1 || "",
        type2: type2 || "",
        type3: type3 || "",
        type4: type4 || ""
      });
    } else {
      // Setting default language for both existing and new projects
      this.setState({
        defaultLanguages: defaultLanguages
      });
    }
  }

  render() {
    const { isExisting, defaultLanguages } = this.state;

    return (
      <I18n ns="translations">
        {(t, { i18n }) => (
          <div className="g-row set-project">
            <br />
            {isExisting ? (
              <h1>{t("create-project.header-edit")}</h1>
            ) : (
              <h1>{t("create-project.header")}</h1>
            )}
            {isExisting ? (
              <h3>{t("create-project.subtitle-edit")}</h3>
            ) : (
              <h3>{t("create-project.subtitle")}</h3>
            )}
            <form noValidate onSubmit={this.handleSubmit}>
              <div className="form-input">
                <span>{t("create-project.name-placeholder")}</span>
                {this.renderInput(
                  "name",
                  t("create-project.name-placeholder"),
                  t,
                  true,
                  "0",
                  true
                )}
              </div>

              <div className="form-input">
                <span>{t("create-project.task-types")}</span>
                <br />
                <span>{t("create-project.task-types-explain")}</span>
                {this.renderInput(
                  "type0",
                  t("task.types.planning"),
                  t,
                  true,
                  "0",
                  true
                )}
                {this.renderInput(
                  "type1",
                  t("task.types.shifts"),
                  t,
                  true,
                  "0",
                  true
                )}
                {this.renderInput(
                  "type2",
                  t("task.types.camps"),
                  t,
                  true,
                  "0",
                  true
                )}
                {this.renderInput(
                  "type3",
                  t("task.types.art"),
                  t,
                  true,
                  "0",
                  true
                )}
                {this.renderInput(
                  "type4",
                  t("task.types.other"),
                  t,
                  true,
                  "0",
                  true
                )}
              </div>

              {this.renderPopularTags(t)}
              <br />
              <span>{t("create-project.extra-fields-explain")}</span>
              {this.renderExtraFields(t)}

              <div>
                {this.renderSelect(
                  "language",
                  t("create-project.select-language"),
                  defaultLanguages,
                  t,
                  "0"
                )}
              </div>

              <div className="form-input">
                <span>{t("create-project.visibility-placeholder")}</span>
                <br />
                <span>{t("create-project.visibility-explain")}</span>
                <br />
                {this.renderCheckbox(
                  "isPublic",
                  t("create-project.visibility"),
                  t,
                  true
                )}
                <br />
              </div>

              <CollapsibleContainer trigger="Advanced - Click for more">
                <div className="form-input">
                  {this.renderCheckbox(
                    "canCreateTask",
                    t("create-project.can-create-task"),
                    t,
                    true
                  )}
                  <br />
                  {this.renderCheckbox(
                    "canAssignTask",
                    t("create-project.can-assign-task"),
                    t,
                    true
                  )}
                </div>

                <div className="form-input">
                  <span>{i18n.t("create-project.custom-domain")}</span>
                  {this.renderInput(
                    "domainUrl",
                    i18n.t("create-project.custom-domain-placeholder"),
                    t,
                    true,
                    "0",
                    true
                  )}
                  <Fragment>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: i18n.t("create-project.custom-domain-explain", {
                          interpolation: { escapeValue: false }
                        })
                      }}
                    />
                  </Fragment>
                </div>
              </CollapsibleContainer>

              <br />
              {this.renderSubmit(t)}
            </form>
            <br />
          </div>
        )}
      </I18n>
    );
  }

  renderInput(fieldName, placeholder, t, isEditable, tabIndex, isAutoFocus) {
    const classNames = isEditable ? " editable" : "";
    return (
      <Textbox
        className={"changing-input" + classNames}
        type="text"
        tabIndex={tabIndex}
        name={fieldName}
        value={this.state[fieldName]}
        placeholder={placeholder}
        ref={e => (this[fieldName + "Input"] = e)}
        onChange={this.handleChange}
        onKeyUp={() => {}} // here to trigger validation callback on Key up
        disabled={!isEditable}
        autofocus={isAutoFocus}
        validationOption={{
          required: false,
          msgOnError: t("task.errors.not-empty")
        }}
        validationCallback={res =>
          this.setState({
            validations: { ...this.state.validations, [fieldName]: res }
          })
        }
      />
    );
  }

  renderCheckbox(fieldName, placeholder, t, isEditable) {
    const classNames = isEditable ? " editable" : "";
    return (
      <label>
        <input
          className={classNames}
          type="checkbox"
          checked={this.state[fieldName]}
          value={placeholder}
          onChange={e => {
            this.setState({ [fieldName]: !this.state[fieldName] });
          }}
          disabled={!isEditable}
        />
        {placeholder}
      </label>
    );
  }

  renderSelect(fieldName, placeholder, options, translation, tabIndex) {
    return (
      <Select
        type="text"
        name={fieldName}
        value={this.state[fieldName]}
        tabIndex={tabIndex}
        onChange={e => {
          this.handleChangeSelect(e, fieldName);
        }}
        options={options}
        isSearchable={false}
        placeholder={placeholder}
        noResultsText={translation("general.no-results-found")}
        searchable={false}
      />
    );
  }

  renderPopularTags(translation) {
    const showPlaceholder = this.state.popularTags.length === 0;
    return (
      <TagsInput
        className={"react-tagsinput-changing"}
        tabIndex={"0"}
        value={this.state.popularTags}
        onChange={this.handleTagsChange}
        onlyUnique={true}
        addOnBlur={true}
        inputProps={{
          placeholder: showPlaceholder
            ? translation("create-project.popular-tags")
            : ""
        }}
        onRemove={this.handleTagsChange}
      />
    );
  }

  renderExtraFields(translation) {
    const showPlaceholder = this.state.extraFields.length === 0;
    return (
      <TagsInput
        className={"react-tagsinput-changing extra-fields"}
        tabIndex={"0"}
        value={this.state.extraFields}
        onChange={this.handleExtraFieldsChange}
        onlyUnique={true}
        addOnBlur={true}
        inputProps={{
          placeholder: showPlaceholder
            ? translation("create-project.extra-fields")
            : ""
        }}
        onRemove={this.handleExtraFieldsChange}
      />
    );
  }

  renderSubmit(t) {
    return this.state.isExisting ? (
      <input
        className={"button button-small"}
        type="submit"
        value={t("create-project.submit-btn-edit")}
      />
    ) : (
      <input
        className={"button button-small"}
        type="submit"
        value={t("create-project.submit-btn")}
      />
    );
  }

  handleChangeSelect(selected, fieldName) {
    let val = null;
    if (selected) {
      val = selected;
    }
    this.setState({ [fieldName]: val });
  }

  handleChange(n, e) {
    let fieldName = e.target.name;
    this.setState({
      [fieldName]: e.target.value
    });
  }

  handleTagsChange(popularTags) {
    // Clear leading and trailing white space
    for (let i = 0; i < popularTags.length; i++) {
      popularTags[i] = popularTags[i].trim();
    }
    this.setState({ popularTags: popularTags });
  }

  handleExtraFieldsChange(extraFields) {
    // Clear leading and trailing white space
    for (let i = 0; i < extraFields.length; i++) {
      extraFields[i] = extraFields[i].trim();
    }
    this.setState({ extraFields: extraFields });
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    if (!this.isValid()) {
      this.props.showError(i18n.t("create-project.err-incomplete"));
      return;
    }

    // Create is actually set, so it works the same for update / create
    this.props.createProject(this.state.projectUrl, this.getFormFields());
    if (this.state.isExisting) {
      this.props.showSuccess(i18n.t("create-project.success-edit"));
    } else {
      this.props.showSuccess(i18n.t("create-project.success"));
    }
    this.props.history.push("/" + this.state.projectUrl + "/task/1");
  }

  isValid() {
    const englishRegex = /^[A-Za-z0-9_-]*$/;
    // Allows http://domain.com https://domain.com AND www.domain.com (which may be problematic)
    const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
    let res = false;
    Object.values(this.state.validations).forEach(x => (res = x || res));
    res = res || this.state.name.length === 0;
    res = res || this.state.projectUrl.length === 0;
    res = res || this.state.projectUrl.match(englishRegex) === null;
    res = res || this.state.type0.length === 0;
    res = res || this.state.type1.length === 0;
    res = res || this.state.type2.length === 0;
    res = res || this.state.type3.length === 0;
    res = res || this.state.type4.length === 0;
    res = res || this.state.type4.length === 0;
    res = res || !this.state.language || this.state.language.value.length === 0;
    // Only if domain url is supplied
    if (this.state.domainUrl && this.state.domainUrl.length >= 0) {
      res =
        res ||
        (!this.state.domainUrl.startsWith("http") &&
          !this.state.domainUrl.startsWith("https"));
      res = res || this.state.domainUrl.match(urlRegex) === null;
    }

    return !res;
  }

  toTagObject(array) {
    let result = {};
    let counter = 0;
    array.forEach(tag => {
      const color =
        appConfig.colorTags.length > counter
          ? appConfig.colorTags[counter++]
          : "eb1478";
      result[tag] = color;
    });
    return result;
  }

  fromTagObject(tagObjects) {
    if (tagObjects) {
      return Object.keys(tagObjects);
    }
  }

  getFormFields() {
    const { auth } = this.props;

    const {
      popularTags,
      projectUrl,
      name,
      language,
      isPublic,
      canCreateTask,
      type0,
      type1,
      type2,
      type3,
      type4,
      canAssignTask,
      extraFields,
      domainUrl
    } = this.state;

    const creator = {
      id: auth.id,
      name: auth.name,
      email: auth.updatedEmail || auth.email,
      photoURL: auth.photoURL
    };

    const taskTypes = [type0, type1, type2, type3, type4];

    // TODO: add color support
    const popularTagsAsMap = this.toTagObject(popularTags);

    return {
      url: projectUrl,
      name: name,
      creator: creator,
      taskTypes: taskTypes,
      language: language,
      isPublic: isPublic,
      canCreateTask: canCreateTask,
      canAssignTask: canAssignTask,
      popularTags: popularTagsAsMap,
      extraFields: extraFields,
      domainUrl: domainUrl,
      created: new Date()
    };
  }
}

SetProject.propTypes = {
  createProject: PropTypes.func.isRequired,
  selectProjectFromUrl: PropTypes.func.isRequired,
  loadProjects: PropTypes.func.isRequired
};

//=====================================
//  CONNECT
//-------------------------------------
const mapStateToProps = state => {
  return {
    auth: state.auth,
    selectedProject: state.projects.selectedProject
  };
};

const mapDispatchToProps = Object.assign(
  {},
  notificationActions,
  projectActions
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetProject);
