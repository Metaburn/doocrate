import React from 'react';
import { Link } from 'react-router-dom';
import Icon from "../icon"

export default ({icon, path, active}) => {
  return (
    <div className={"bottom-nav-tile"}>
      <Link to={path}>
        <Icon className={'bottom-nav-icon'} name={icon}/>
      </Link>
      {active && (<div className={"active"}/>)}
    </div>
  )
}
