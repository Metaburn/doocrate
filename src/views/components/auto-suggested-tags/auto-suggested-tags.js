import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TagsInput from 'react-tagsinput';

import './auto-suggested-tags.css';
import i18n from "../../../i18n";

const AutoSuggestedTags = ({value, labels, placeholder, onChange}) => {
  const showPlaceholder = !value || value.length === 0 ;

  function renderLayout (tagComponents, inputComponent) {
    return (
      <span className={`auto-suggested-wrapper lang-${i18n.language}`}>
        {inputComponent}
        {tagComponents}
      </span>
    )
  }

  function renderSuggestionsContainer({ containerProps , children, query }) {
      return (
        <div {...containerProps} className={"suggestionContainer"}>
          <div className ={"suggestions"}>
          {children}
          </div>
        </div>
      );
    }

  function autocompleteRenderInput ({addTag, ...props}) {
    const handleOnChange = (e, {newValue, method}) => {
      if (method === 'enter') {
        e.preventDefault()
      } else {
        props.onChange(e)
      }
    };

    const inputValue = (props.value && props.value.trim().toLowerCase()) || '';

      let suggestions = Object.keys(labels).filter((l) => {
        return inputValue === l.slice(0, inputValue.length).toLowerCase();
      });

    return (
      <Autosuggest
        ref={props.ref}
        suggestions={suggestions}
        shouldRenderSuggestions={(value) => true}
        getSuggestionValue={(suggestion) => suggestion}
        renderSuggestion={(suggestion) => <div className={"suggestion"}>{suggestion}</div>}
        inputProps={{...props, onChange: handleOnChange}}
        onSuggestionSelected={(e, {suggestion}) => {
          addTag(suggestion)
        }}
        renderSuggestionsContainer = {renderSuggestionsContainer}
        onSuggestionsClearRequested={() => {}}
        onSuggestionsFetchRequested={() => {}}
      />
    );
  }

  return (
    <TagsInput
      value={value}
      onChange={onChange}
      onlyUnique={true}
      className={'react-tagsinput-custom'}
      addOnBlur={true}
      renderInput={autocompleteRenderInput.bind(this)}
      inputProps={{ placeholder: showPlaceholder ? placeholder : ''}}
      renderLayout={renderLayout}
  />
  )
};

AutoSuggestedTags.propTypes = {
  value: PropTypes.array.isRequired,
  labels: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};


export default AutoSuggestedTags;
