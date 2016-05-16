// React
import React from 'react';
import { connect } from 'react-redux';

// Constants
import { PROJECT_ENTER_NON_METRIC_PAGE } from 'constants/project';

class General extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: PROJECT_ENTER_NON_METRIC_PAGE,
    });
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

General.propTypes = {
  currentProject: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentProject: state.project.currentProject,
});

export default connect(mapStateToProps)(General);
