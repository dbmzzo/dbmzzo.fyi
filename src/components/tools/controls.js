import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Toggle from '../elements/toggle';
import './scope.css';
import { ThemeToggler } from 'gatsby-plugin-dark-mode'

const Controls = ({ gridActive, toggleGrid }) => (
  <>
    <Toggle label="⊞" size="small" aria-label="Click here to toggle visibility of vertical rhythym grid" checked={gridActive} handleChange={toggleGrid} />
    <ThemeToggler>
    {({ theme, toggleTheme }) => (

      <Toggle label="☯" size="small" aria-label="Click here to toggle visibility of vertical rhythym grid" checked={theme === 'dark'} handleChange={e => toggleTheme(e.target.checked ? 'dark' : 'light')} />
    )}
    </ThemeToggler>
  </>
);

Controls.propTypes = {
  gridActive: PropTypes.bool.isRequired,
  toggleGrid: PropTypes.func.isRequired,
};

const mapStateToProps = ({ gridActive }) => ({ gridActive });
const mapDispatchToProps = (dispatch) => ({ toggleGrid: () => dispatch({ type: 'TOGGLE_GRID' })});

const ConnectedControls = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Controls);

export default ConnectedControls;
