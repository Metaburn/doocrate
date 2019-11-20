import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './tags-suggestions.css';
import Button from '../button';

class TagsSuggestions extends Component {
  render() {
    const items = this.props.tags.map((tag, index) => {
      return (
        <Button
          key={index}
          onClick={() => {
            this.props.onTagSelected(tag);
          }}
          type="button"
          data-tag={tag}
        >
          <li className="label-default">{tag}</li>
        </Button>
      );
    });

    return (
      <div className="tags-suggestions">
        <div>{items}</div>
      </div>
    );
  }
}

TagsSuggestions.propTypes = {
  tags: PropTypes.array.isRequired,
  onTagSelected: PropTypes.func.isRequired,
};

export default TagsSuggestions;
