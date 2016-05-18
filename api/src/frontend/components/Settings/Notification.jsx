// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { NotificationSettings } from 'frontend/actions';

// Components
import Modal from 'react-modal';

// Constants
import { SLACK_CLIENT_ID } from 'constants/auth';
import { settingsModalStyle } from 'constants/settings';

class Notification extends React.Component {
  componentDidMount() {
    const { currentProject, dispatch } = this.props;
    dispatch(NotificationSettings.enterDashboard());
    dispatch(NotificationSettings.getSlackIntegrationData(currentProject.id));
  }

  _closeModal() {
    const { dispatch } = this.props;
    dispatch(NotificationSettings.closeModal());
  }

  _openModal() {
    const { dispatch } = this.props;
    dispatch(NotificationSettings.openModal());
  }

  _renderModal() {
    const { isModalOpen } = this.props;
    return (
      <Modal isOpen={isModalOpen} onRequestClose={::this._closeModal} style={settingsModalStyle} >
        <center>
          <form role="form" onSubmit={::this._removeSlackIntegeration}>
            <div className="form-group">
              {this._renderModalError()}
              <p className="login-title">REMOVE INTEGRATION</p>
            </div>
            <p>Slack 연동을 취소할까요?</p>
            <button className="login-button" type="submit">REMOVE</button>
            <div className="login-help-parent">
              <a className="login-help" onClick={::this._closeModal}>닫기</a>
            </div>
          </form>
        </center>
      </Modal>
    );
  }

  _renderModalError() {
    const { modalError } = this.props;
    if (!modalError) {
      return false;
    }
    return (
      <div className="error">
        {modalError}
      </div>
    );
  }

  _renderSlackBtn() {
    const { currentProject, fetching } = this.props;
    if (fetching) {
      return false;
    }
    const token = localStorage.getItem('token');
    return (
      <a href={`https://slack.com/oauth/authorize?scope=incoming-webhook&client_id=${SLACK_CLIENT_ID}&state=${token}|${currentProject.id}`}>
        <img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
      </a>
    );
  }

  _renderSlackData() {
    const { slackData } = this.props;
    return (
      <div>
        <p>Send notification to {slackData.team_name}{slackData.channel}</p>
        <p>Integrated @ {slackData.created_at}</p>
        <a href={slackData.configuration_url}>Configure</a>
        <br />
        <a onClick={::this._openModal}>Remove</a>
      </div>
    );
  }

  _removeSlackIntegeration(e) {
    e.preventDefault();
    const { currentProject, dispatch } = this.props;
    dispatch(NotificationSettings.removeSlackIntegeration(currentProject.id));
  }

  render() {
    const { fetching, slackData } = this.props;
    return (
      <div>
        {this._renderModal()}
        <div className="chart-wrapper-header">Slack { fetching ? <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> : null }</div>
        { slackData ? this._renderSlackData() : this._renderSlackBtn() }
      </div>
    );
  }
}

Notification.propTypes = {
  currentProject: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool,
  isModalOpen: React.PropTypes.bool,
  modalError: React.PropTypes.string,
  modalFetching: React.PropTypes.bool,
  slackData: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  currentProject: state.project.currentProject,
  fetching: state.settings.notification.fetching,
  isModalOpen: state.settings.notification.modal.isOpened,
  modalError: state.settings.notification.modal.error,
  modalFetching: state.settings.notification.modal.fetching,
  slackData: state.settings.notification.data,
});

export default connect(mapStateToProps)(Notification);
