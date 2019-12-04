import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toggle from '../elements/toggle';
import './scope.css';

const Controls = ({ gridActive, toggleGrid }) => (
  <Toggle label="grid" size="small" aria-label="Click here to toggle visibility of vertical rhythym grid" checked={gridActive} handleChange={toggleGrid} />
);

Controls.propTypes = {
  gridActive: PropTypes.bool.isRequired,
  toggleGrid: PropTypes.func.isRequired,
};

const mapStateToProps = ({ gridActive }) => ({ gridActive });
const mapDispatchToProps = (dispatch) => ({ toggleGrid: () => dispatch({ type: 'TOGGLE_GRID' }) });

const ConnectedControls = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Controls);

export default ConnectedControls;
