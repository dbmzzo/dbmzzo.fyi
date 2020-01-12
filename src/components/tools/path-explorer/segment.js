import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Segment = ({ command }) => {
  console.log(command);
  const className = classNames('segment');
  return (<g className={className} />);
};

Segment.defaultProps = {
  command: '',
};

Segment.propTypes = {
  command: PropTypes.string,
};

export default Segment;
