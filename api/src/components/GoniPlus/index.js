// React
import React from 'react';
import { connect } from 'react-redux';

// Actions
// import Actions from 'actions/Project';

// Components
import Header from 'components/Header';

class GoniPlus extends React.Component {
  _renderLayout() {
    const { currentProject, fetching } = this.props;
    return (
      <div className="child">
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>{ currentProject.name } { fetching ? <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> : null }</h1>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { currentProject } = this.props;
    if (!currentProject) {
      return false;
    }
    return (
      <div>
        <Header page="projects" />
        {this._renderLayout()}
      </div>
    );
  }
}

GoniPlus.propTypes = {
  currentProject: React.PropTypes.object,
  dispatch: React.PropTypes.func.isRequired,
  fetching: React.PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentProject: state.project.currentProject,
  fetching: state.project.fetching,
});

export default connect(mapStateToProps)(GoniPlus);
