import {
  PROJECT_CHANGE_DASHBOARD,
} from 'constants/project';

import React from 'react';
import { connect } from 'react-redux';

const SidebarItem = (props) => {
  const changeDashboard = item => {
    const { dispatch } = props;
    if (item.key !== props.dashboard.key) {
      dispatch({
        type: PROJECT_CHANGE_DASHBOARD,
        dashboard: item,
      });
    }
  };

  const menu = item => (
    item.key === props.dashboard.key ? (
      <a className="selected">{item.title}</a>
    )
    : (
      <a className="default">{item.title}</a>
    )
  );
  const createItem = (item) => (
    <li key={item.key} onClick={() => changeDashboard(item)}>
      {menu(item)}
    </li>
  );
  const createHeader = (title) => (
    <div key={title} className="sidebar-item">
      <p className="sidebar-header">{title}</p>
    </div>
  );
  return (
    <div className="sidebar-section">
        {createHeader(props.menu.header)}
        <ul className="sidebar-menu">
          {props.menu.item.map(createItem)}
        </ul>
    </div>
  );
};

SidebarItem.propTypes = {
  dashboard: React.PropTypes.object.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  menu: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  dashboard: state.project.dashboard,
});

export default connect(mapStateToProps)(SidebarItem);
