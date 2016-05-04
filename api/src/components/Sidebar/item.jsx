import {
  PROJECT_CHANGE_DASHBOARD,
} from 'constants/project';
import {
  METRIC_CLEAR_ALL,
} from 'constants/metric';

import React from 'react';
import { connect } from 'react-redux';

const SidebarItem = (props) => {
  const changeDashboard = key => {
    const { dispatch } = props;
    if (key !== props.currentDashboard) {
      dispatch({
        type: METRIC_CLEAR_ALL,
      });
      dispatch({
        type: PROJECT_CHANGE_DASHBOARD,
        selected: key,
      });
    }
  };

  const menu = item => (
    item === props.currentDashboard ? (
      <a className="selected">{item}</a>
    )
    : (
      <a className="default">{item}</a>
    )
  );
  const createItem = (item) => (
    <li key={item} onClick={() => changeDashboard(item)}>
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
  currentDashboard: React.PropTypes.string.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  menu: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentDashboard: state.project.currentDashboard,
});

export default connect(mapStateToProps)(SidebarItem);
