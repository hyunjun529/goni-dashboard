// React
import React from 'react';
import { connect } from 'react-redux';

class AuthContainer extends React.Component {
  render() {
    const { currentUser } = this.props;
    if (!currentUser) return false;
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

AuthContainer.propTypes = {
  children: React.PropTypes.node,
  currentUser: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(AuthContainer);
