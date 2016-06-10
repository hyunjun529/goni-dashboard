// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { MemberSettings } from 'frontend/actions';

// Components
import Modal from 'react-modal';

// Constants
import { settingsModalStyle } from 'constants/settings';

class Member extends React.Component {
  componentDidMount() {
    const { project, dispatch } = this.props;
    dispatch(MemberSettings.enterDashboard());
    dispatch(MemberSettings.getMemberList(project.id));
  }

  _addUser(e) {
    e.preventDefault();
    const { project, dispatch } = this.props;
    let { member } = this.props;
    const data = {
      email: this.refs.email.value,
    };
    if (member === null) {
      member = [];
    }
    dispatch(MemberSettings.addMember(project.id, data, member));
  }

  _closeModal() {
    const { dispatch } = this.props;
    dispatch(MemberSettings.closeModal());
  }

  _openAddModal() {
    const { dispatch } = this.props;
    dispatch(MemberSettings.openModal('add'));
  }

  _openRemoveModal(e, id) {
    const { dispatch } = this.props;
    dispatch(MemberSettings.openModal('remove', id));
  }

  _removeUser(e) {
    e.preventDefault();
    const { dispatch, member, modalData, project } = this.props;
    dispatch(MemberSettings.removeMember(project.id, modalData, member));
  }

  _renderAddMember() {
    return (
      <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4" onClick={::this._openAddModal}>
        <div className="project-card" style={{ overflow: 'auto' }}>
          <h3>INVITE MEMBER</h3>
          <div className="tag-tab" style={{ float: 'right' }}>
            <a>INVITE</a>
          </div>
        </div>
      </div>
    );
  }

  _renderMembers() {
    const { member } = this.props;
    if (!member) {
      return false;
    }
    return member.map((m) => {
      return (
        <div key={m.id} className="col-xs-12 col-sm-6 col-md-4 col-lg-4" onClick={(e) => ::this._openRemoveModal(e, m.id)}>
          <div className="project-card" style={{ overflow: 'auto' }}>
            <h3>{m.email}</h3>
            <div className="tag-tab" style={{ float: 'right' }}>
              <a>REMOVE</a>
            </div>
          </div>
        </div>
      );
    });
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

  _renderModal() {
    const { isModalOpen, modalType } = this.props;
    switch (modalType) {
      case 'remove':
        return (
          <Modal isOpen={isModalOpen} onRequestClose={::this._closeModal} style={settingsModalStyle} >
            <center>
              <form role="form" onSubmit={::this._removeUser}>
                <div className="form-group">
                  {this._renderModalError()}
                  <p className="login-title">REMOVE MEMBER</p>
                </div>
                <p>해당 멤버를 삭제할까요?</p>
                <button className="login-button" type="submit">REMOVE</button>
                <div className="login-help-parent">
                  <a className="login-help" onClick={::this._closeModal}>닫기</a>
                </div>
              </form>
            </center>
          </Modal>
        );
      default:
        return (
          <Modal isOpen={isModalOpen} onRequestClose={::this._closeModal} style={settingsModalStyle} >
            <center>
              <form role="form" onSubmit={::this._addUser}>
                <div className="form-group">
                  {this._renderModalError()}
                  <p className="login-title">INVITE MEMBER</p>
                  <div className="login-input-wrapper">
                    <input ref="email" className="login-input-username" placeholder="User Email" type="text" required />
                  </div>
                </div>
                <button className="login-button" type="submit">INVITE</button>
                <div className="login-help-parent">
                  <a className="login-help" onClick={::this._closeModal}>닫기</a>
                </div>
              </form>
            </center>
          </Modal>
        );
    }
  }

  render() {
    const { memberFetching } = this.props;
    return (
      <div>
        {this._renderModal()}
        <div className="chart-wrapper-header">Member { memberFetching ? <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> : null } </div>
        <div className="row">
          {this._renderMembers()}
          {this._renderAddMember()}
        </div>
      </div>
    );
  }
}

Member.propTypes = {
  dispatch: React.PropTypes.func.isRequired,
  isModalOpen: React.PropTypes.bool,
  member: React.PropTypes.array,
  memberFetching: React.PropTypes.bool,
  modalData: React.PropTypes.any,
  modalError: React.PropTypes.string,
  modalFetching: React.PropTypes.bool,
  modalType: React.PropTypes.string,
  project: React.PropTypes.object,
};

const mapStateToProps = (state) => ({
  isModalOpen: state.settings.member.modal.isOpened,
  member: state.settings.member.data,
  memberFetching: state.settings.member.fetching,
  modalData: state.settings.member.modal.data,
  modalError: state.settings.member.modal.error,
  modalFetching: state.settings.member.modal.fetching,
  modalType: state.settings.member.modal.type,
  project: state.project.project.data,
});

export default connect(mapStateToProps)(Member);
