import React from 'react';

import {I18n} from 'react-i18next';
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
      name_he:'גל ברכה',
      name_en: 'Gal Bracha',
      img:'http://placekitten.com/550/350?image=4'
    },{
      name_he:'מתן זוהר',
      name_en:'Matan Zohar',
      img:'http://placekitten.com/550/350?image=8'
    },{
      name_he:'דניאל ברוקס',
      name_en:'Daniel Broks',
      img:'http://placekitten.com/550/350?image=10'
    },{
      name_he:'אור גרנות',
      name_en:'Or Granot',
      img:'http://placekitten.com/550/350?image=15'
    },{
      name_he:'רקפת בר סלע',
      name_en:'Rakefet Bar Sela',
      img:'http://placekitten.com/550/350?image=11'
    },{
      name_he:'הילה היילו',
      name_en:'Hila Halo Lor',
      img:'http://placekitten.com/550/350?image=2'
    },{
      name_he:'יערה מסיקה',
      name_en:'Yarra Mesika',
      img:'http://placekitten.com/550/350?image=12'
    },{
      name_he:'הילה זני',
      name_en:'Hila Zeni',
      img:'http://placekitten.com/550/350?image=13'
    },{
      name_he:'יונתן רוסאק',
      name_en:'Yonatan Rossak',
      img:'http://placekitten.com/550/350?image=9'
    },{
      name_he:'רותם בונדר',
      name_en:'Rotem Bonder',
      img:'http://placekitten.com/550/350?image=14'
    },{
      name_he:'טל לותן',
      name_en:'Tal Lotan',
      img:'http://placekitten.com/550/350?image=3'
    },{
      name_he:'הילה ברזילי',
      name_en:'Hila Barzilai',
      img:'http://placekitten.com/550/350?image=16'
    },{
      name_he:'Nate',
      name_en:'Nate',
      img:'http://placekitten.com/550/350?image=5'
    },{
      name_he:'אורי קדוש',
      name_en:'Ori Kadosh',
      img:'http://placekitten.com/550/350?image=18'
    },{
      name_he:'ניר בניטה',
      name_en:'Nir-Benita',
      img:'http://placekitten.com/550/350?image=8'
    }
    ];

    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    humans = shuffle(humans);

    return (
      <I18n ns='translations'>
        {
          (t, {i18n}) => (
        <div className='about-carousel'>
            <div className='slide-container'>
              <Fade {...properties}>
                {
                  humans.map(person => {
                    return (
                      <div key={person.name_en} className='each-fade'>
                        <h3 className='person-name'>
                          {person[`name_${t('lang')}`]}
                          </h3>
                        <div className='image-container'>
                          <Img src={person.img}/>
                        </div>
                      </div>
                    )
                  })
                }
              </Fade>
            </div>
        </div>
          )}
      </I18n>
    );
  }
}

export default AboutCarousel;
