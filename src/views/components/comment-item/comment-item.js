import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './comment-item.css';
import Img from 'react-image';
import Moment from 'react-moment';
import 'moment/locale/he';
import 'moment-timezone';
import Linkify from 'react-linkify';
import {I18n} from 'react-i18next';
import Icon from "../icon";
import ToolTip from "react-portal-tooltip";
import Button from "../button";
import Textarea from "react-textarea-autosize";

export class CommentItem extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      body: this.props.comment.body,
      isInEditMode: false
    };

  }

  componentWillMount() {
    this.updateStateByProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateStateByProps(nextProps);
  }

  updateStateByProps(props) {
    this.setState({body: props.comment.body});
  }

  isValid = () => {
    return (this.state.body && this.state.body.length > 1)
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.isValid()) {
      return;
    }

    this.props.updateComment(this.props.comment, {body: this.state.body});
    this.setState({isInEditMode: false});
  };

  onRemoveComment = () => {
    this.props.removeComment(this.props.comment);
  };

  cancelEditComment = () => {
    this.setState({body: this.props.comment.body, isInEditMode: false});
  };

  shouldDisplayTooltip = () => {
    return this.props.comment.creator.id === this.getCurrentUserId();
  };

  getCurrentUserId = () => {
    if (!this.props.auth) {
      return null;
    }
    return this.props.auth.id;
  };

  render() {
    const {comment} = this.props;

    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className='comment-item'>
              <form className='comment-form' onSubmit={this.handleSubmit} noValidate>
                {this.renderHeader(t, comment)}
                {this.renderBody(t)}
                {this.renderSubmit(t)}
              </form>
            </div>
          )
        }
      </I18n>
    );
  }

  renderHeader(t, comment) {
    if (!comment.creator) return;
    const {creator} = comment;
    const avatar = creator.photoURL ? <Img className='avatar' src={creator.photoURL} alt={comment.creator.name}/> : '';
    return (
      <div className='comment-header'>
        {this.renderTooltip(t)}
        <div className='comment-item-creator'>
          <span>{avatar} {creator.name} <Moment locale={t('lang')} unix fromNow>{comment.created.seconds}</Moment></span>
        </div>
      </div>
    );
  }

  renderTooltip(t) {
    if (!this.shouldDisplayTooltip()){
      return(<span className='comment-item-tooltip'/>);
    }

    return (
      <div id={`comment-${this.props.commentNumber}`} className='comment-item-tooltip'
           onMouseEnter={() => this.setState({isTooltipActive: true})}
           onMouseLeave={() => this.setState({isTooltipActive: false})}>
        <Icon name='more_horiz'/>
        <ToolTip active={this.state.isTooltipActive} position='bottom' arrow='left'
                 parent={`#comment-${this.props.commentNumber}`}>
          <span className={`tooltip-container dir-${t('lang-float')}`}>
            <div>
              <Button className='button-no-border'
                      onClick={() => this.setState({isInEditMode: true})}><Icon id='edit-icon' name='edit'/> {t('comments.edit-comment')}</Button></div>
            <div>
              <Button className='button-no-border'
                      onClick={this.onRemoveComment}><Icon className={'tooltip-icons'} name='delete'/>  {t('comments.delete-comment')}</Button>
            </div>
                </span>
        </ToolTip>
      </div>
    );
  }

  renderBody(t) {
    const {body, isInEditMode} = this.state;
    return (
      <div className='comment-body'>
        {isInEditMode ?
          this.renderBodyEditMode(t, body)
          :
          <Linkify>
            {body}
          </Linkify>
        }
      </div>
    )
  }

  renderBodyEditMode(t, body) {
    return (
      <Textarea
        className='textarea-body'
        name='comment-body'
        value={body}
        placeholder={t('comments.placeholder')}
        ref={e => this['bodyInput'] = e}
        onChange={(e) => this.setState({body: e.target.value})}
      />
    );
  }

  renderSubmit(t) {
    if (!this.state.isInEditMode) return;

    return (
      <div className='button-update-comment'>
        <input className={`button button-small button-update-comment ${this.state.showHideSideSubmit}`}
               type="submit" value={t('comments.update-comment')}/>
        <Button className={`button button-small button-update-comment ${this.state.showHideSideSubmit}`}
                onClick={this.cancelEditComment}>
          {t('comments.cancel-edit-comment')}
        </Button>
      </div>
    );
  }
}

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  commentNumber: PropTypes.number.isRequired,
  removeComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};


export default CommentItem;
