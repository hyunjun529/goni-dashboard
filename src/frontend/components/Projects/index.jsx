// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
import { Projects as ProjectAction } from 'frontend/actions';

// Components
import { Header } from 'frontend/components';
import CopyToClipboard from 'frontend/core/CopyToClipboard';
import Modal from 'react-modal';

// Constants
import {
  PROJECTS_MODAL_OPEN,
  PROJECTS_MODAL_CLOSE,
} from 'constants/projects';

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

class Projects extends React.Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: PROJECTS_MODAL_CLOSE,
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(ProjectAction.getProjects());
  }

  _closeModal() {
    const { dispatch } = this.props;
    dispatch({
      type: PROJECTS_MODAL_CLOSE,
    });
  }

  _createNewProject(e) {
    e.preventDefault();
    const { dispatch } = this.props;
    const data = {
      name: this.refs.name.value,
      isPlus: true,
    };
    dispatch(ProjectAction.createProject(data));
  }

  _handleKeyCopied() {
    alert('API Key가 복사되었습니다');
  }

  _handleProjectClick(e, project) {
    const { dispatch } = this.props;
    dispatch(ProjectAction.enterProject(project));
  }

  _handleProjectGuideClick(e) {
    e.stopPropagation();
    window.open('https://github.com/layer123/goni');
  }

  _handleNewProjectClick() {
    const { dispatch } = this.props;
    dispatch({
      type: PROJECTS_MODAL_OPEN,
    });
  }

  _renderModal() {
    const { isModalOpen } = this.props;
    return (
      <Modal isOpen={isModalOpen} onRequestClose={::this._closeModal} style={modalStyle} >
        <center>
          <form role="form" onSubmit={::this._createNewProject}>
            <div className="form-group">
              <p className="login-title">NEW PROJECT</p>
              <div className="login-input-wrapper">
                <input ref="name" className="login-input-username" placeholder="Project Name" type="text" required />
              </div>
            </div>
            <button className="login-button" type="submit">CREATE</button>
            <div className="login-help-parent">
              <a className="login-help">현재 Goni+ 프로젝트만 생성하실 수 있습니다.</a>
            </div>
          </form>
        </center>
      </Modal>
    );
  }

  _renderProjects() {
    const { projects } = this.props;
    return projects.map((project) => {
      return (
        <div key={project.id} className="pj-item" onClick={(e) => this._handleProjectClick(e, project)}>
          <small onClick={(e) => this._handleProjectClick(e, project)}>
            {project.is_plus ? <p className="isplus">Goni+</p> : <p className="isplus">Goni</p>}
          </small>

          <h3>
            {project.name}
          </h3>
          
          <CopyToClipboard onCopy={() => this._handleKeyCopied()} text={project.apikey}>
            <div className="tag" ref="clip-tag-wrap">
              <a ref="clip-tag">APIKEY : {project.apikey.substr(0, 6)}</a>
            </div>
          </CopyToClipboard>
        </div>
      );
    });
  }

  _renderNewProjectBtn() {
    return (
      <div className="pj-item" onClick={(e) => this._handleNewProjectClick(e)}>
        <small>
          NEW PROJECT
        </small>
        
        <h3>
          + 프로젝트 추가
        </h3>
        
        <div className="tag" onClick={(e) => this._handleProjectGuideClick(e)}>
          <a>QUICKSTART GUIDE</a>
        </div>
      </div>
    );
  }

  _renderLayout() {
    const { fetching } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="projects">
            <h1>PROJECTS { fetching ? <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> : null }</h1>
            <hr/>
            <div className="row">
              {this._renderProjects()}
              {this._renderNewProjectBtn()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this._renderModal()}
        <Header page="projects" />
        {this._renderLayout()}
      </div>
    );
  }
}

Projects.propTypes = {
  currentUser: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool.isRequired,
  isModalOpen: React.PropTypes.bool,
  projects: React.PropTypes.array,
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
  fetching: state.projects.fetching,
  isModalOpen: state.projects.isModalOpen,
  projects: state.projects.list,
});

export default connect(mapStateToProps)(Projects);
