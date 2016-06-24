import React from 'react';

function getMinute(duration) {
  switch (duration) {
    case '30m':
      return 30;
    case '1h':
      return 60;
    case '3h':
      return 180;
    case '6h':
    default: // 6h
      return 360;
  }
}

export const getDuration = (duration) => {
  const now = Date.now();
  const from = now - 60000 * getMinute(duration);
  return [from, now];
};

export const realtimeColorAccessor = (s) => {
  const k = parseInt(s, 10);
  if (k === 0) {
    return '#4c80f1';
  }
  if (k === 1) {
    return '#ffda00';
  }
  return '#ff7595';
};

export const realtimeColorAccessorByTime = (s) => {
  if (s <= 12) {
    return '#4c80f1';
  }
  if (s <= 32) {
    return '#ffda00';
  }
  return '#ff7595';
};

export const responseColorAccessor = (s) => {
  const status = parseInt(s, 10);
  if (status < 400) {
    return '#4c80f1';
  }
  if (status < 500) {
    return '#ffda00';
  }
  return '#ff7595';
};

export const tickInterval = (duration) => {
  switch (duration) {
    case '30m':
      return {
        unit: 'minute',
        interval: 3,
      };
    case '1h':
      return {
        unit: 'minute',
        interval: 5,
      };
    case '3h':
    default: // 6h
      return {
        unit: 'minute',
        interval: 20,
      };
  }
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

export const Error = (props) => {
  return (
    <div>
      <div className="chart-wrapper-header">{props.title}</div>
      <div className="chart-wrapper-placeholder">{props.msg}</div>
    </div>
  );
};

Error.propTypes = {
  title: React.PropTypes.string.isRequired,
  msg: React.PropTypes.string.isRequired,
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
