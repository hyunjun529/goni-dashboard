// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Auth as AuthAction } from 'frontend/actions';

// Components
import { Header } from 'frontend/components';

// Constants
import { AUTH_CLEAR_ERROR } from 'constants/auth';

class Register extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: AUTH_CLEAR_ERROR,
    });
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
    dispatch(AuthAction.registerUser(data));
  }

  render() {
    return (
      <div>
        <Header page="register" />
        <div className="container">
          <div className="row">
            <div className="login">
              <h1 className="text-center">Goni Dashboard</h1>
              <form role="form" onSubmit={::this._registerUser}>
                <div className="form-group">
                  <input ref="email" type="email" className="form-control" placeholder="Email" required />
                  <input ref="username" type="text" className="form-control" placeholder="Username" required />
                  <input ref="password" type="password" className="form-control" placeholder="Password" required />
                </div>
                <div className="form-group">
                  <p className="help-block text-center">
                    <a>이용약관</a>
                  </p>
                </div>
                <button type="submit" className="btn btn-default">REGISTER</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  errors: React.PropTypes.string,
};

const mapStateToProps = (state) => ({
  errors: state.auth.error,
});

export default connect(mapStateToProps)(Register);
