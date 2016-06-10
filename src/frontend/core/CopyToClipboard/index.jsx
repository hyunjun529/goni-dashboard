// https://github.com/nkbt/react-copy-to-clipboard/blob/master/src/CopyToClipboard.js
// add e.stopPropagation() for prevent element onClick event calling
import React from 'react';
import copy from 'copy-to-clipboard';

const onClick = (text, onCopy) => (e) => {
  e.stopPropagation();
  copy(text);
  if (onCopy) {
    onCopy(text);
  }
};

const CopyToClipboard = (props) => {
  const elem = React.Children.only(props.children);
  return React.cloneElement(elem, {
    props,
    onClick: onClick(props.text, props.onCopy),
  });
};

CopyToClipboard.propTypes = {
  children: React.PropTypes.element.isRequired,
  text: React.PropTypes.string.isRequired,
  onCopy: React.PropTypes.func,
};

export default CopyToClipboard;
