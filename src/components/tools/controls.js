import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toggle from '../elements/toggle';
import './scope.css';

const Controls = ({ gridActive, toggleGrid, darkActive, toggleDark }) => (
  <>
    <Toggle label="grid" size="small" aria-label="Click here to toggle visibility of vertical rhythym grid" checked={gridActive} handleChange={toggleGrid} />
  </>
);

Controls.propTypes = {
  gridActive: PropTypes.bool.isRequired,
  toggleGrid: PropTypes.func.isRequired,
  darkActive: PropTypes.bool.isRequired,
  toggleDark: PropTypes.func.isRequired,
};

const mapStateToProps = ({ gridActive, darkActive }) => ({ gridActive, darkActive });
const mapDispatchToProps = (dispatch) => ({ toggleGrid: () => dispatch({ type: 'TOGGLE_GRID' }), toggleDark: () => dispatch({type: 'TOGGLE_DARK'}) });

const ConnectedControls = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Controls);

export default ConnectedControls;
