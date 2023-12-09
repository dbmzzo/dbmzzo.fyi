import PropTypes from "prop-types"
import React from "react"
import "./spinner.css"

const Spinner = ({animated}) => {
  const spinnerClass =`spinner ${animated && 'rect'}`; 
  const hexClass =`spinner ${animated && 'hex'}`; 
  return (
    <svg viewBox="0 0 100 100" width="100">
    <circle className="spinner circle" cx="50" cy="50" r="45"/>
    <rect className={spinnerClass} x="25" y="25" width="50" height="50" />
    <polygon className={hexClass} points="63,57.5 50,65 37,57 37,42.5 50,35 63,42.5" />
    </svg>
  )
}

export default Spinner

