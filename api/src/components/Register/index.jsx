// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import Actions from 'actions/Auth';

// Components
import Header from 'components/Header';

class Register extends React.Component {
  constructor() {
    super();
    this._registerUser = this._registerUser.bind(this);
    this._renderError = this._renderError.bind(this)
  }

  _renderError() {
    const { errors } = this.props;
    if (!errors) return false;
    return (
      <div className="error">
        {errors}
      </div>
    );
  }

  _registerUser(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    const data = {
      email: this.refs.email.value,
      password: this.refs.password.value,
      username: this.refs.username.value,
    };
    dispatch(Actions.registerUser(data));
  }

  render() {
    return (
      <div>
        <Header page="register" />
        <div className="child">
          <div className="login-parent">
            <div className="login-middle">
              <div className="login-child">
                <form role="form" onSubmit={this._registerUser}>
                  <div className="form-group">
                    {this._renderError()}
                    <p className="login-title">회원가입</p>
                    <div className="login-input-wrapper">
                      <input ref="email" className="login-input-email" placeholder="Email" type="text" required />
                    </div>
                    <div className="login-input-wrapper">
                      <input ref="username" className="login-input-username" placeholder="Username" type="text" required />
                    </div>
                    <div className="login-input-wrapper">
                      <input ref="password" className="login-input-password" placeholder="Password" type="password" required />
                    </div>
                  </div>
                  <button className="login-button" type="submit">REGISTER</button>
                  <div className="login-help-parent">
                    <a className="login-help">이용약관</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  errors: state.auth.errors,
});

export default connect(mapStateToProps)(Register);
