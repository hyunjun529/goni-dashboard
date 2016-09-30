// React
import React from 'react';
import { connect } from 'react-redux';

// Component
import SidebarItem from './item';

class Sidebar extends React.Component {
  constructor() {
    super();
    this.state = {
      liked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({liked: !this.state.liked});
  }

  _renderItems() {
    const { menu } = this.props;
    return menu.map((section) => {
      return <SidebarItem key={section.header} menu={section} />;
    });
  }

  render() {
    return (
      <div className={this.state.liked ? 'subnav toggled' :'subnav'} onClick={this.handleClick}>
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
