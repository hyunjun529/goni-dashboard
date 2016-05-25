// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Auth as AuthAction } from 'frontend/actions';

// Components
import { Header } from 'frontend/components';

// Constants
import { AUTH_CLEAR_ERROR } from 'constants/auth';

class Login extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: AUTH_CLEAR_ERROR,
    });
  }

  _login(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    const data = {
      email: this.refs.email.value,
      password: this.refs.password.value,
    };
    dispatch(AuthAction.login(data));
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

  render() {
    return (
      <div>
        <Header page="login" />
        <div className="child">
          <div className="login-parent">
            <div className="login-middle">
              <div className="login-child">
                <form role="form" onSubmit={::this._login}>
                  <div className="form-group">
                    {::this._renderError()}
                    <p className="login-title">GONI DASHBOARD</p>
                    <div className="login-input-wrapper">
                      <input ref="email" className="login-input-email" placeholder="Email" type="text" required />
                    </div>
                    <div className="login-input-wrapper">
                      <input ref="password" className="login-input-password" placeholder="Password" type="password" required />
                    </div>
                  </div>
                  <div className="login-help-parent">
                    <a className="login-help">비밀번호를 잊으셨나요?</a>
                  </div>
                  <div className="login-button-wrapper">
                    <button className="login-button" type="submit">LOGIN</button>
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

Login.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  errors: React.PropTypes.string,
};

const mapStateToProps = (state) => ({
  errors: state.auth.error,
});

export default connect(mapStateToProps)(Login);
