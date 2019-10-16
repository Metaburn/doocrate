import React, {Component, Fragment} from 'react';

import './filter-menu.css';

class FilterMenu extends Component {

  render() {
   return(
     <Fragment>
       <a id="home" className="bm-item" href="/">Home</a>
       <a id="about" className="bm-item" href="/about">About</a>
       <a id="contact" className="bm-item" href="/contact">Contact</a>
     </Fragment>
   );
  }


}

export default FilterMenu;
