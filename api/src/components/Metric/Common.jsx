import React from 'react';

export const tickInterval = {
  unit: 'minute',
  interval: 1,
};

export const tooltipFormat = (v, u) => (
  <div>{`${v.yValue}${u} @ ${v.xValue}`}</div>
);

export const Empty = (props) => {
  return (
    <div>
      <div className="chart-wrapper-header">{props.title}</div>
      <div className="chart-wrapper-placeholder">표시할 데이터가 없습니다</div>
    </div>
  );
};

Empty.propTypes = {
  title: React.PropTypes.string.isRequired,
};

export const Loading = (props) => {
  return (
    <div>
      <div className="chart-wrapper-header">{props.title}</div>
      <div className="chart-wrapper-placeholder">
        {
          props.fetching ?
          <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> :
          '데이터를 가져오는도중 문제가 발생했습니다'
        }
      </div>
    </div>
  );
};

Loading.propTypes = {
  fetching: React.PropTypes.bool.isRequired,
  title: React.PropTypes.string.isRequired,
};
