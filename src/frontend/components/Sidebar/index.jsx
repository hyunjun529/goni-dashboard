// React
import React from 'react';
import { connect } from 'react-redux';

// Component
import SidebarItem from './item';

class Sidebar extends React.Component {
  _renderItems() {
    const { menu } = this.props;
    return menu.map((section) => {
      return <SidebarItem key={section.header} menu={section} />;
    });
  }

  render() {
    return (
      <div className="sidebar">
        {this._renderItems()}
      </div>
    );
  }
}

Sidebar.propTypes = {
  menu: React.PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  currentDashboard: state.project.currentDashboard,
});

export default connect(mapStateToProps)(Sidebar);
