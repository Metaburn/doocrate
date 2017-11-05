import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button';
import Img from 'react-image';
import ToolTip from 'react-portal-tooltip';
import MyProfileTooltip from '../my-profile-tooltip';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'

import './header.css';

const menuContent = `<div>
<Img className='avatar' src={auth.photoURL} alt={auth.name}/>
<Button onClick={signOut}>התנתקי</Button>
</div>`;

const Header = ({auth, signOut}) => (
  <header className="header">
    <div className="g-row">
      <div className="g-col">
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          pauseOnHover
        />
      <ul className="header-actions">
          {auth ?
            <div>
              <MyProfileTooltip
                auth = { auth }
                signOut = { signOut }
              />
              { auth.photoURL ?
                <div className='task-item-assignee' data-html={true} data-tip={menuContent}/>
                : <div data-html={true} data-tip={
                    <div>
                    אני
                    <Button onClick={signOut}>התנתקי</Button>
                    </div>
                  } />
              }

            </div>
            : null
          }
        </ul>
        <h1 className="header-title"><a href='/'>Doocrate</a></h1>
      </div>
    </div>
  </header>
);

Header.propTypes = {
  auth: PropTypes.object.isRequired,
  signOut: PropTypes.func.isRequired
};


export default Header;
