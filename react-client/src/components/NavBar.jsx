import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Button, Icon, message } from 'antd';
import axios from 'axios';
import { CSSTransitionGroup } from 'react-transition-group';

import Logo from '../assets/logo.png';
import WrappedLoginForm from './LoginForm';
import RegistrationLandingModal from './RegistrationLandingModal';

import { toggleLoginModal, logoutUser } from '../actions/loginActions';
import { toggleRegistrationModal } from '../actions/registrationActions';

const NavBar = (props) => {
  const logout = () => {
    axios.post('/logout').then(() => {
      props.history.push('/');
      message.info('You have been logged out!');
      props.logoutUser();
    });
  };

  const { user } = props;
  return (
    <CSSTransitionGroup
      transitionName="fade-appear"
      transitionAppear
      transitionAppearTimeout={500}
      transitionEnter={false}
      transitionLeave={false}
    >
      <div className="nav-bar-container">
        <div name="nav-bar" className="nav-bar">
          <div className="logo-div nav-item">
            <img src="https://i.imgur.com/FCiswFq.png" alt="waggl-logo" />
          </div>
          <div className="home-div nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </div>
          <div className="find-dog-div nav-item">
            <Link className="nav-link" to="/search">Find A Dog</Link>
          </div>
          <div className="about-div nav-item">
            <Link className="nav-link" to="/about">About Us</Link>
          </div>
          {user && user.org_id > 1 &&
          <div className="create-dog nav-item">
            <Link className="nav-link" to="/create">Add a Dog</Link>
          </div>
          }
          {user && user.org_id > 1 &&
          <div className="profile nav-item">
            <Link className="nav-link" to="/profile">Org Profile</Link>
          </div>
          }
          {props.user && props.user.org_id === 1 && props.newMessages &&
          <div className="profile nav-item">
            <Link className="nav-link" to="/profile">Adopter Profile</Link>
            <Icon style={{ marginLeft: '-2px' }} type="mail" />
          </div>
          }
          {props.user && props.user.org_id === 1 && !props.newMessages &&
          <div className="profile nav-item">
            <Link className="nav-link" to="/profile">Adopter Profile</Link>
          </div>
          }
          {user ?
            <div className="logout nav-item">
              <Button className="logout-button user-button" onClick={() => logout()} size="large" type="primary" icon="idcard">Log Out</Button>
            </div> :
            <div className="login nav-item">
              <Button className="login-button user-button" onClick={props.toggleLoginModal} size="large" type="primary" icon="idcard">Log In</Button>
            </div>
          }
          {!user &&
            <div className="signup nav-item">
              <Button className="signup-button user-button" onClick={props.toggleRegistrationModal} size="large" type="primary" icon="solution">Sign Up</Button>
            </div>
          }
          {!user &&
            <div className="facebook nav-item">
              <Button className="facebook button" size="large" type="primary" icon="facebook"><a href="/auth/facebook" style={{ color: 'white' }}>Login via Facebook</a></Button>
            </div>
          }
        </div>
        <WrappedLoginForm />
        <RegistrationLandingModal />
      </div>
    </CSSTransitionGroup>
  );
};

const mapStateToProps = state => (
  {
    visible: state.loginModal.visible,
    landing: state.registrationModal.landing,
    user: state.storeUser.user,
    newMessages: state.newMessages.newMessages,
  }
);

const mapDispatchToProps = {
  toggleLoginModal,
  toggleRegistrationModal,
  logoutUser,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));
