import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './toggle.css';

const Toggle = ({
  size, checked, disabled, label, handleChange, ariaLabel, tabIndex, standard,
}) => {
  const className = classNames('toggle', size, { standard });

  const sizes = {
    normal: '1em',
    large: '2em',
    small: '.9em',
  };

  return (
    <label className={className}>
      <input
        aria-label={ariaLabel}
        disabled={disabled}
        defaultChecked={checked}
        onChange={handleChange}
        tabIndex={tabIndex}
        type="checkbox"
      />
      <svg height={sizes[size]} viewBox="0,0 48,24">
        <rect
          className="channel"
          x="0"
          y="0"
          rx="12"
          width="48"
          height="24"
        />
        <rect
          className="focus-highlight"
          x="1"
          y="1"
          rx="11"
          width="46"
          height="22"
        />
        <rect
          className="knob"
          x="4"
          y="4"
          rx="8"
          width="16"
          height="16"
        />
      </svg>
      <span className="text-label">
        {label}
      </span>
    </label>
  );
};

Toggle.defaultProps = {
  ariaLabel: 'Click here to toggle checkbox',
  checked: false,
  disabled: false,
  handleChange: null,
  standard: false,
  size: 'normal',
  label: '',
  tabIndex: '0',
};

Toggle.propTypes = {
  size: PropTypes.string,
  ariaLabel: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
  label: PropTypes.string,
  standard: PropTypes.bool,
  tabIndex: PropTypes.string,
};

export default Toggle;
