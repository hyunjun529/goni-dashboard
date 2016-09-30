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

  // TODO: too many code duplication
  _renderHeader() {
    switch (this.props.page) {
      case 'login':
        return (
          <div className="container">
            <div className="navbar-header">

              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>

              <a className="navbar-brand" href="#" onClick={() => this._home()}>GONI</a>
            </div>

            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <li><a href="https://github.com/layer123/goni"><i className="fa fa-github" aria-hidden="true"></i> GITHUB</a></li>
                <li><a href="#" onClick={() => this._register()}>REGISTER</a></li>
              </ul>
            </div>
          </div>
        );
      case 'register':
        return (
          <div className="container">
            <div className="navbar-header">

              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>

              <a className="navbar-brand" href="#" onClick={() => this._home()}>GONI</a>
            </div>

            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <li><a href="https://github.com/layer123/goni"><i className="fa fa-github" aria-hidden="true"></i> GITHUB</a></li>
                <li><a href="#" onClick={() => this._login()}>LOGIN</a></li>
              </ul>
            </div>
          </div>
        );
      default:
        return (
          <div className="container-fluid">
            <div className="navbar-header">

              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>

              <a className="navbar-brand" href="#" onClick={() => this._home()}>GONI</a>
            </div>

            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav navbar-right">
                <li><a href="https://github.com/layer123/goni"><i className="fa fa-github" aria-hidden="true"></i> GITHUB</a></li>
                <li><a href="#" onClick={() => this._logout()}>LOGOUT</a></li>
              </ul>
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <div className="navbar navbar-default navbar-fixed-top">
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
