import React from 'react';

import Img from 'react-image';
import { Fade } from 'react-slideshow-image';

import signInAsset from '../../components/sign-in-carousel/sign-in-asset.svg';
import signInAsset2 from '../../components/sign-in-carousel/sign-in-asset2.svg';
import signInAsset3 from '../../components/sign-in-carousel/sign-in-asset3.svg';

import './sign-in-carousel.css';

class SignInCarousel extends React.Component {

  render() {
    const properties = {
      autoplay: true,
      duration: 3000,
      transitionDuration: 1500,
      infinite: true,
      indicators: false,
      arrows: false,
    };

    return (
      <div className='sign-in-carousel'>
        <div className="slide-container">
          <Fade {...properties}>
            <div className="each-fade">
              <div className="image-container">
                <Img src={signInAsset} />
              </div>
            </div>
            <div className="each-fade">
              <div className="image-container">
                <Img src={signInAsset2} />
              </div>
            </div>
            <div className="each-fade">
              <div className="image-container">
                <Img src={signInAsset3} />
              </div>
            </div>
          </Fade>
        </div>
      </div>
    );
  }
}

export default SignInCarousel;
