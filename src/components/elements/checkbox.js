import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './toggle.css';

const Checkbox = ({
  checked, disabled, label, handleChange, ariaLabel, tabIndex,
}) => {
  const [isFocused, setIsFocused] = useState();
  const [isChecked, setIsChecked] = useState(checked);
  const inputRef = useRef({ checked });

  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (typeof document !== 'undefined' && document.activeElement === inputRef.current) inputRef.current.focus();
  }, [isFocused]);

  useEffect(() => {
    if (!handleChange) inputRef.current.checked = isChecked;
  }, [checked, handleChange, isChecked]);

  const className = classNames('toggle', size, {
    checked: handleChange ? checked : isChecked, disabled, square, focused: isFocused,
  });

  const toggleChecked = () => {
    if (handleChange) handleChange();
    else setIsChecked(!isChecked);
  };

  return (
    <label className={className}>
      <input
        aria-label={ariaLabel}
        checked={handleChange ? checked : isChecked}
        disabled={disabled}
        onChange={() => toggleChecked()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={inputRef}
        tabIndex={tabIndex}
        type="checkbox"
      />
      {label}
      <svg height="24px" width="48px" viewBox="0,0 48,24">
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
    </label>
  );
};

Toggle.defaultProps = {
  ariaLabel: 'Click here to toggle checkbox',
  checked: false,
  disabled: false,
  handleChange: null,
  label: '',
  tabIndex: '0',
};

Toggle.propTypes = {
  ariaLabel: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
  label: PropTypes.string,
  tabIndex: PropTypes.string,
};

export default Toggle;
