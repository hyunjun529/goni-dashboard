// React
import React from 'react';
import { connect } from 'react-redux';
import {
  push,
} from 'react-router-redux';

// Actions
import Actions from 'actions/Auth';

class Header extends React.Component {
  constructor() {
    super();
    this._home = this._home.bind(this);
  }

  _home(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    dispatch(dispatch(push('/')));
  }

  _logout() {
    const { dispatch } = this.props;
    dispatch(Actions.logout());
  }

  _renderHeader() {
    switch (this.props.page) {
      case 'login':
        return (
          <div>
            <ul className="header-left">
              <li>
                <a href="#" onClick={this._home}>GONI</a>
              </li>
            </ul>
            <ul className="header-right">
              <li>
                <a href="https://github.com/layer123/goni"><i className="fa fa-github" aria-hidden="true" /> GITHUB</a>
              </li>
              <li>
                <a href="/register">REGISTER</a>
              </li>
            </ul>
          </div>
        );
      case 'register':
        return (
          <div>
            <ul className="header-left">
              <li>
                <a href="#" onClick={this._home}>GONI</a>
              </li>
            </ul>
            <ul className="header-right">
              <li>
                <a href="https://github.com/layer123/goni"><i className="fa fa-github" aria-hidden="true" /> GITHUB</a>
              </li>
              <li>
                <a href="/login">LOGIN</a>
              </li>
            </ul>
          </div>
        );
      default:
        return (
          <div>
            <ul className="header-left">
              <li>
                <a href="#" onClick={this._home}>GONI</a>
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
