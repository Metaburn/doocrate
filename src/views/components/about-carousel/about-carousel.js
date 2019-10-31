import React from 'react';

import together from './together.png';
import './about-carousel.css';
import i18n from 'src/i18n';

class AboutCarousel extends React.Component {
  render() {

    let humans = [{
      name_he:'גל ברכה',
      name_en: 'Gal Bracha',
    },{
      name_he:'מתן זוהר',
      name_en:'Matan Zohar',
    },{
      name_he:'דניאל ברוקס',
      name_en:'Daniel Broks',
    },{
      name_he:'אור גרנות',
      name_en:'Or Granot',
    },{
      name_he:'רקפת בר סלע',
      name_en:'Rakefet Bar Sela',
    },{
      name_he:'הילה היילו',
      name_en:'Hila Halo Lor',
    },{
      name_he:'יערה מסיקה',
      name_en:'Yarra Mesika',
    },{
      name_he:'הילה זני',
      name_en:'Hila Zeni',
    },{
      name_he:'יונתן רוסאק',
      name_en:'Yonatan Rossak',
    },{
      name_he:'רותם בונדר',
      name_en:'Rotem Bonder',
    },{
      name_he:'טל לותן',
      name_en:'Tal Lotan',
    },{
      name_he:'הילה ברזילי',
      name_en:'Hila Barzilai',
    },{
      name_he:'נייט',
      name_en:'Nate',
    },{
      name_he:'אורי קדוש',
      name_en:'Ori Kadosh',
    },{
      name_he:'ניר בניטה',
      name_en:'Nir-Benita',
    },
    {
      name_he:'אנטון נוסוביצקי',
      name_en: 'Anton Nosovitsky',
    }
    ];

    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    humans = shuffle(humans);
    humans = shuffle(humans);

    return (
    <div className='about-carousel'>
      <img src={together} alt={'Team'}/>
      <br/><br/>
      {i18n.t('about.faces')}
      <br/><br/>
      {
        humans.map(person => {
          return (
          <h3 key={person.name_en} className='person-name'>
            {person[`name_${i18n.t('lang')}`]}&nbsp;
            </h3>
          )
        })
      }
      <br/>
      <h3 className={'person-name'}>
        {i18n.t('about.you')}
      </h3>
    </div>
    )
  }
}

export default AboutCarousel;
