import PropTypes from "prop-types"
import React from "react"
import styles from "./eye.css"
import {useSpring, animated} from "react-spring"
import {useState, useEffect} from "react" 

const Eye = () => {

  const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const closed = {
    transform: "scaleY(0.0)"
  }

  const open = {
    transform: "scaleY(1.0)"
  }

  const blink = {
    from: closed,
    to: async next => {
      while (1) {
        await next(open)
        await delay(8000)
        await next(closed)
      }
    },
    delay: 2000
  }

  const noSmile = {
    strokeDasharray: "1 100",
    strokeDashoffset: "-23",
    opacity: 0,
  }

  const smile = {
    strokeDasharray: "25 100",
    strokeDashoffset: "-11",
    opacity: 1
  }

  const [eyeProps, setEyeProps, stopEyeProps] = useSpring(() => (
    {...blink} 
  ))

  const [smileProps, setSmileProps, stopSmileProps] = useSpring(() => (
  {
    from: {...noSmile},
    to: {...smile}
  }))

  const hide = () => {
    setSmileProps({
      to: {...noSmile}
    })
    setEyeProps({
      to: {...closed}
    })
  }

  const show = () => {
    setSmileProps({
      to: {...smile},
    })
    setEyeProps({...blink, delay: 0})
  }

  return (
    <svg className="eye" width="72px" height="72px" viewBox="0,0 100,100"
      onMouseOver={() => hide()}
      onMouseOut={() => show()}
    >
      <circle cx="50" cy="50" r="50" />
      <g className="eyes">
        <g className="left">
          <animated.path style={eyeProps} d="M50,58 C55.5,58 60.5,55.5 65,50.5 C60.5,45.5 55.5,43 50,43 C44.5,43 39.5,45.5 35,50.5 C39.5,55.5 44.5,58 50,58 Z" />
          <circle cx="50" cy="51" r="6" />
        </g>
        <g className="right">
          <animated.path style={eyeProps} d="M50,58 C55.5,58 60.5,55.5 65,50.5 C60.5,45.5 55.5,43 50,43 C44.5,43 39.5,45.5 35,50.5 C39.5,55.5 44.5,58 50,58 Z" />
          <circle cx="50" cy="51" r="6" />
        </g>
      </g>
      <g className="smile">
        <animated.path style={smileProps} d="M35,43 C35,51.2842712 41.7157288,58 50,58 C58.2842712,58 65,51.2842712 65,43" />
      </g>
    </svg>
  )
}

export default Eye

