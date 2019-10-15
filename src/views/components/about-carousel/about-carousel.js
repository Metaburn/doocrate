import React, {Fragment} from 'react';

import Img from 'react-image';
import { Fade } from 'react-slideshow-image';

import './about-carousel.css';

class AboutCarousel extends React.Component {
  render() {
    const properties = {
      autoplay: true,
      duration: 3000,
      transitionDuration: 1500,
      infinite: true,
      indicators: false,
      arrows: false,
    };

    let humans = [{
      name:'גל ברכה',
      img:'http://placekitten.com/550/350?image=4'
    },{
      name:'מתן זוהר',
      img:'http://placekitten.com/550/350?image=8'
    },{
      name:'דניאל ברוקס',
      img:'http://placekitten.com/550/350?image=10'
    },{
      name:'אור גרנות',
      img:'http://placekitten.com/550/350?image=15'
    },{
      name:'רקפת בר סלע',
      img:'http://placekitten.com/550/350?image=11'
    },{
      name:'הילה היילו',
      img:'http://placekitten.com/550/350?image=2'
    },{
      name:'יערה מסיקה',
      img:'http://placekitten.com/550/350?image=12'
    },{
      name:'הילה זני',
      img:'http://placekitten.com/550/350?image=13'
    },{
      name:'יונתן רוסאק',
      img:'http://placekitten.com/550/350?image=9'
    },{
      name:'רותם בונדר',
      img:'http://placekitten.com/550/350?image=14'
    },{
      name:'טל לותן',
      img:'http://placekitten.com/550/350?image=3'
    },{
      name:'הילה ברזילי',
      img:'http://placekitten.com/550/350?image=16'
    },{
      name:'Nate',
      img:'http://placekitten.com/550/350?image=5'
    },{
      name:'אורי קדוש',
      img:'http://placekitten.com/550/350?image=18'
    },{
      name:'ניר בניטה',
      img:'http://placekitten.com/550/350?image=8'
    }
    ];

    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    humans = shuffle(humans);

    return (
      <div className='about-carousel'>
          <div className='slide-container'>
            <Fade {...properties}>
              {
                humans.map(person => {
                  return (
                    <Fragment key={person.name} className='each-fade'>
                      <h3 className='person-name'>{person.name}</h3>
                      <div className='image-container'>
                        <Img src={person.img}/>
                      </div>
                    </Fragment>
                  )
                })
              }
            </Fade>
          </div>
      </div>
    );
  }
}

export default AboutCarousel;
