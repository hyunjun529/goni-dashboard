// React
import React from 'react';
import { connect } from 'react-redux';

// Constants
import { SLACK_CLIENT_ID } from 'constants/auth';
import { PROJECT_ENTER_NON_METRIC_PAGE } from 'constants/project';

class Notification extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: PROJECT_ENTER_NON_METRIC_PAGE,
    });
  }

  render() {
    const { currentProject } = this.props;
    const token = localStorage.getItem('token');
    return (
      <div>
        <div className="chart-wrapper-header">Slack</div>
        <a href={`https://slack.com/oauth/authorize?scope=incoming-webhook&client_id=${SLACK_CLIENT_ID}&state=${token}|${currentProject.id}`}>
          <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
        </a>
      </div>
    );
  }
}

Notification.propTypes = {
  currentProject: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentProject: state.project.currentProject,
});

export default connect(mapStateToProps)(Notification);
