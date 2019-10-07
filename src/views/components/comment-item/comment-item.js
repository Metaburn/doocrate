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

  componentWillReceiveProps(nextProps) {
    this.setState({body: this.props.comment.body});
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (!this.state.body || this.state.body.length <= 1) {
      return;
    }

    this.props.updateComment(this.props.comment, {body: this.state.body});
    this.setState({isInEditMode: false});
  }

  onRemoveComment = () => {
    this.props.removeComment(this.props.comment);
  }

  cancelEditComment = () => {
    this.setState({body: this.props.comment.body, isInEditMode: false});
  }

  shouldDisplayTooltip = () => {
    return this.props.comment.creator.id === this.getCurrentUserId();
  }

  getCurrentUserId() {
    if (!this.props.auth) {
      return null;
    }
    return this.props.auth.id;
  }

  render() {
    const {comment} = this.props;

    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
            <div className='comment-item'>
              <div>
                <form onSubmit={this.handleSubmit} noValidate>
                  {this.renderHeader(t, comment)}
                  {this.renderBody(t)}
                  {this.renderSubmit(t)}
                </form>
              </div>
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
      <div>
        {this.renderTooltip(t)}
        <div className='comment-item-creator'>
          <span>{avatar} {creator.name} <Moment locale={t('lang')} unix fromNow>{comment.created.seconds}</Moment></span>
        </div>
      </div>
    );
  }

  renderTooltip(t) {
    if (this.shouldDisplayTooltip()) {
      return (
        <div id={`comment-${this.props.commentNumber}`} className='comment-item-tooltip-container'
             onMouseEnter={() => this.setState({isTooltipActive: true})}
             onMouseLeave={() => this.setState({isTooltipActive: false})}>
          <Icon name='keyboard_arrow_down'/>
          <ToolTip active={this.state.isTooltipActive} position='bottom' arrow='left'
                   parent={`#comment-${this.props.commentNumber}`}>
                  <span className='tooltip-container'>
                    <div><Button className='button-no-border'
                                 onClick={() => this.setState({isInEditMode: true})}>{t('comments.edit-comment')}</Button></div>
                    <div><Button className='button-no-border'
                                 onClick={this.onRemoveComment}>{t('comments.delete-comment')}</Button></div>
                  </span>
          </ToolTip>
        </div>
      );
    }
  }

  renderBody(t) {

    const {body, isInEditMode} = this.state;
    if (isInEditMode) {
      return (
        <div className='comment-body'>
          <Textarea
            className='textarea-body'
            name='comment-body'
            value={body}
            placeholder={t('comments.placeholder')}
            ref={e => this['bodyInput'] = e}
            onChange={(e) => this.setState({body: e.target.value})}
          />
        </div>
      );
    }

    return (
      <div className='comment-body'>
        <Linkify>
          {body}
        </Linkify>
      </div>
    );
  }

  renderSubmit(t) {
    if (this.state.isInEditMode) {
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
}

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  commentNumber: PropTypes.number.isRequired,
  removeComment: PropTypes.func.isRequired,
  updateComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};


export default CommentItem;
