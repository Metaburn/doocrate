import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Tour from 'reactour';
import Emoji from "../emoji/emoji";

import './tourDoocrate.css';

/*
  A Walk-through / tour component for the app
  Coupled through css data selectors
 */
class TourDoocrate extends Component {
  constructor(props) {
    super(props);

    this.steps = [
      {
        content: `Welcome to the Doocrate! click the arrow`
      },
      {
        selector: '[data-tour="one"]',
        content: () => (
          <div>
            <p>
              This is how you create a new task <Emoji symbol="🐳"/><Emoji symbol="🎋"/>
            </p>
          </div>
        ),
      },
      {
        selector: '[data-tour="two"]',
        content: () => (
          <div>
            <p>
              This is where you search for tasks or humans <span role={"img"}><Emoji symbol="🧞‍🧜‍🧚‍🧙"/>‍</span>
            </p>
          </div>
        ),
      },
      {
        selector: '[data-tour="three"]',
        content: () => (
          <div>
            <p>
              Here is the Filter - You can search by category or any popular tags
            </p>
          </div>
        ),
      },
      {
        selector: '[data-tour="four"]',
        content: () => (
          <div>
            <p>
              And here is your personal space - where you will found your personal tasks list.
            </p>
            <p>Go ahead and click it</p>
          </div>
        ),
      },
      {
        selector: '[data-tour="five"]',
        content: () => (
          <div>
            <p>
              That's it! have fun! <Emoji symbol="🙌👩🏼‍🎤 👨🏼‍🎤"/>
            </p>
          </div>
        ),
      }
    ];
  }

  render() {
    const { tour } = this.props;
    return(
        <Tour
          steps={this.steps}
          isOpen={tour.isShow}
          className={"tour-doocrate-helper"}
          onRequestClose={this.props.onCloseTour}
          rounded={8}/>
      );
    }
}

TourDoocrate.propTypes = {
  tour:PropTypes.object,
  onCloseTour: PropTypes.func.isRequired
};

export default TourDoocrate;
