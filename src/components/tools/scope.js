import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import './scope.css';

const Scope = ({ gridActive }) => {
  const className = classNames('scope', { 'grid-active': gridActive });
  return (
    <aside className={className} />
  );
};

Scope.propTypes = {
  gridActive: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ gridActive }) => ({ gridActive });

const ConnectedScope = connect(
  mapStateToProps,
)(Scope);

export default ConnectedScope;
