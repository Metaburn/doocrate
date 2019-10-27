import React, {Component, Fragment} from "react";
import PropTypes from "prop-types";

import Button from "../../components/button/button";
import Icon from "../../components/icon/icon";
import Img from 'react-image';

import RichTextEditor from "../../atoms/richTextEditor";

import './myPortfolio.css';
class MyPortfolio extends Component {

  constructor(props) {
    super(props);

    this.state = {
      bio: '',
      isEditing: false
    };
  }

  componentWillMount() {
    this.setState({bio: this.props.auth.bio})
  }

  onToggleEditing = () => {
    this.setState({isEditing:!this.state.isEditing});
  };

  render() {
    const { auth, i18n } = this.props;

    return (
      <div className='my-portfolio'>
        {auth && auth.photoURL ?
          <div className={'avatar-wrapper'}>
            <Img className={'avatar'} src={auth.photoURL}/>
          </div>
          :
          ''
        }
        {auth && auth.name &&
        <Fragment>
              <span className={'user-name'} onClick={() => {
                this.props.isShowUpdateProfile(true, true)
              }}>
                <Button className={'edit-email'} onClick={() => {
                  this.props.isShowUpdateProfile(true, true)
                }}>
                  <Icon name='edit' alt={i18n.t('general.click-to-edit')}/>
                </Button>
                {auth.name}
              </span>
        </Fragment>
        }

        <form className='user-form' onSubmit={this.handleSubmit}>
          {this.renderBio()}
          {this.renderSubmit()}
        </form>

      </div>
    )
  }

  onEditorChange = (event, editor) => {
    this.setState({
      bio: editor.getData()
    });
  };

  renderBio() {
    const { i18n } = this.props;

    if(!this.state.bio && !this.state.isEditing) {
      return (<span>
        {i18n.t('my-space.bio-empty')}
        &nbsp;
        <Button className={'button-as-link'} onClick={ this.onToggleEditing }>{i18n.t('my-space.bio-empty-action')}</Button>
        &nbsp;
        {i18n.t('my-space.bio-empty-encourage')}
      </span>);
    }

    return(<RichTextEditor
      i18n={i18n}
      data={this.state.bio}
      isEditing={this.state.isEditing}
      onChange={this.onEditorChange}
      onBlur={this.handleSubmit}
      onToggleEditing={this.onToggleEditing}/>)
  }

  renderSubmit() {
    const {i18n} = this.props;
    if(!this.state.isEditing) {
      return;
    }
    return (
      <div className={'submit-wrapper'}>
        <input className={`button button-small`}
               type="submit" value={i18n.t('user.submit')}/>
      </div>
    );
  }

  handleSubmit = (event) => {
    if(event && typeof(event.preventDefault) === "function") {
      event.preventDefault();
    }

    const fieldsToUpdate = {
      uid: this.props.auth.id,
      bio: this.state.bio,
    };

    this.setState({isEditing: false});

    this.props.updateUserData(fieldsToUpdate);
  };
}

MyPortfolio.propTypes = {
  auth: PropTypes.object.isRequired,
  showSuccess: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
  updateUserData: PropTypes.func.isRequired,
  isShowUpdateProfile: PropTypes.func.isRequired
};

export default MyPortfolio;
