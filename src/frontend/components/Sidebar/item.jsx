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
      <a><strong>{item.title}</strong></a>
    )
    : (
      <a>{item.title}</a>
    )
  );
  const createItem = (item) => (
    <li key={item.key} onClick={() => changeDashboard(item)}>
      {menu(item)}
    </li>
  );
  const createHeader = (title) => (
    <li key={title}>
      <h4>{title}</h4>
    </li>
  );
  return (
    <ul>
        {createHeader(props.menu.header)}
        {props.menu.item.map(createItem)}
    </ul>
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
