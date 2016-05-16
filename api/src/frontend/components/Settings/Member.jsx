// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Project as ProjectAction } from 'frontend/actions';

// Components
import Modal from 'react-modal';

// Constants
import {
  PROJECT_ENTER_NON_METRIC_PAGE,
  PROJECT_MODAL_CLOSE,
} from 'constants/project';

const modalStyle = {
  overlay: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 1000,
  },
  content: {
    position: 'none',
    width: '300px',
  },
};

class Member extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: PROJECT_ENTER_NON_METRIC_PAGE,
    });
  }

  componentDidMount() {
    const { currentProject, dispatch } = this.props;
    dispatch(ProjectAction.getProjectMemberList(currentProject.id));
  }

  _closeModal() {
    const { dispatch } = this.props;
    dispatch({
      type: PROJECT_MODAL_CLOSE,
    });
  }

  _addUser(e) {
    e.preventDefault();
    const { currentProject, dispatch } = this.props;
    let { member } = this.props;
    const data = {
      email: this.refs.email.value,
    };
    if (member === null) {
      member = [];
    }
    dispatch(ProjectAction.addUserToProject(currentProject.id, data, member));
  }

  _openAddModal() {
    const { dispatch } = this.props;
    dispatch(ProjectAction.openModal('add'));
  }

  _openRemoveModal(e, id) {
    const { dispatch } = this.props;
    dispatch(ProjectAction.openModal('remove', id));
  }

  _removeUser(e) {
    e.preventDefault();
    const { currentProject, dispatch, member, modalData } = this.props;
    dispatch(ProjectAction.removeUserFromProject(currentProject.id, modalData, member));
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
    const { settingError } = this.props;
    if (!settingError) {
      return false;
    }
    return (
      <div className="error">
        {settingError}
      </div>
    );
  }

  _renderModal() {
    const { isModalOpen, modalType } = this.props;
    switch (modalType) {
      case 'remove':
        return (
          <Modal isOpen={isModalOpen} onRequestClose={::this._closeModal} style={modalStyle} >
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
          <Modal isOpen={isModalOpen} onRequestClose={::this._closeModal} style={modalStyle} >
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
        <div className="chart-wrapper-header">{ 'Member ' }
        {
          memberFetching ?
          <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> :
          null
        }
        </div>
        <div className="row">
          {this._renderMembers()}
          {this._renderAddMember()}
        </div>
      </div>
    );
  }
}

Member.propTypes = {
  currentProject: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  isModalOpen: React.PropTypes.bool,
  member: React.PropTypes.array,
  memberFetching: React.PropTypes.bool,
  modalData: React.PropTypes.any,
  modalType: React.PropTypes.string,
  settingError: React.PropTypes.string,
  settingUpdated: React.PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentProject: state.project.currentProject,
  isModalOpen: state.project.isModalOpen,
  member: state.project.member,
  memberFetching: state.project.memberFetching,
  modalData: state.project.modalData,
  modalType: state.project.modalType,
  settingError: state.project.settingError,
  settingUpdated: state.project.settingUpdated,
});

export default connect(mapStateToProps)(Member);
