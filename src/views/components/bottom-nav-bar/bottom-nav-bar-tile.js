import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import Icon from "../icon"

export default ({icon, path, active}) => {
  const activeClass = active? 'active': '';
  return (
    <Fragment>
      <Link className={`bottom-nav-tile ${activeClass}`} to={path}>
        <Icon className={'bottom-nav-icon'} name={icon}/>
      </Link>

    </Fragment>
  )
}
