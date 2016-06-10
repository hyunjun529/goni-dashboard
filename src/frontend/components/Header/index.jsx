// React
import React from 'react';
import { connect } from 'react-redux';
import {
  push,
} from 'react-router-redux';

// Actions
import { Auth as AuthAction } from 'frontend/actions';

class Header extends React.Component {
  _home() {
    const { dispatch } = this.props;
    dispatch(push('/'));
  }

  _login() {
    const { dispatch } = this.props;
    dispatch(push('/login'));
  }

  _logout() {
    const { dispatch } = this.props;
    dispatch(AuthAction.logout());
  }

  _register() {
    const { dispatch } = this.props;
    dispatch(push('/register'));
  }

  _renderHeader() {
    switch (this.props.page) {
      case 'login':
        return (
          <div>
            <ul className="header-left">
              <li>
                <a href="#" onClick={() => this._home()}>GONI</a>
              </li>
            </ul>
            <ul className="header-right">
              <li>
                <a href="https://github.com/layer123/goni"><i className="fa fa-github" aria-hidden="true" /> GITHUB</a>
              </li>
              <li>
                <a href="#" onClick={() => this._register()}>REGISTER</a>
              </li>
            </ul>
          </div>
        );
      case 'register':
        return (
          <div>
            <ul className="header-left">
              <li>
                <a href="#" onClick={() => this._home()}>GONI</a>
              </li>
            </ul>
            <ul className="header-right">
              <li>
                <a href="https://github.com/layer123/goni"><i className="fa fa-github" aria-hidden="true" /> GITHUB</a>
              </li>
              <li>
                <a href="#" onClick={() => this._login()}>LOGIN</a>
              </li>
            </ul>
          </div>
        );
      default:
        return (
          <div>
            <ul className="header-left">
              <li>
                <a href="#" onClick={() => this._home()}>GONI</a>
              </li>
            </ul>
            <ul className="header-right">
              <li>
                <a href="https://github.com/layer123/goni"><i className="fa fa-github" aria-hidden="true" /> GITHUB</a>
              </li>
              <li>
                <a href="#">MYPAGE</a>
              </li>
              <li>
                <a href="#" onClick={() => this._logout()}>LOGOUT</a>
              </li>
            </ul>
          </div>
        );
    }
  }

  render() {
    return (
      <div className="header">
        {this._renderHeader()}
      </div>
    );
  }
}

Header.propTypes = {
  currentUser: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  isDashboard: React.PropTypes.bool.isRequired,
  page: React.PropTypes.string,
};

Header.defaultProps = {
  isDashboard: false,
};

const mapStateToProps = (state) => ({ currentUser: state.auth.currentUser });

export default connect(mapStateToProps)(Header);
