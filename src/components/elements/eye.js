import PropTypes from "prop-types"
import React from "react"
import styles from "./eye.css"
import {useSpring, animated, config} from "react-spring"
import {useState, useEffect} from "react" 

const Eye = () => {

  const delay = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  const openTo = (amount) => {
    return {
      transform: `scaleY(${amount})`
    }
  }

  const closed = {
    transform: "scaleY(0.0)"
  }

  const open = {
    transform: "scaleY(1.0)"
  }

  const wakeUp = {
    from: closed,
    config: config.wobbly, 
    to: async next => {
      await next({...openTo("0.65"), config: config.default})
      await delay(1750)
      await next({...open, config: config.default})
    },
    delay: 2000,
    onRest: () => {
      setEyeProps(blink)
    },
  }

  const blink = {
    config: config.default,
    to: async next => {
      while (1) {
        await next(open)
        await delay(8000)
        await next(closed)
      }
    }
  }

  const noSmile = {
    strokeDasharray: "1 100",
    strokeDashoffset: "-16",
    strokeWidth: 0,
  }

  const smile = {
    strokeDasharray: "25 100",
    strokeDashoffset: "-4.5",
    strokeWidth: 3,
  }

  const lookLeft = {
    transform: "translateX(-5px)"
  }

  const lookRight = {
    transform: "translateX(5px)"
  }

  const lookAhead = {
    transform: "translateX(0px)"
  }

  const [eyeProps, setEyeProps, stopEyeProps] = useSpring(() => (
    {...wakeUp} 
  ))

  const sneak = {
    from: {...lookAhead},
    to: async next => {
      await next(lookLeft)
      await next(lookRight)
      await next(lookAhead)
    },
    delay: 2500
  }

  const [pupilProps, setPupilProps, stopPupilProps] = useSpring(() => (sneak))

  const [smileProps, setSmileProps, stopSmileProps] = useSpring(() => (
  {
    from: {...noSmile},
    to: {...smile},
    delay: 4500
  }))

  const stopAll = () => {
    stopEyeProps()
    stopSmileProps()
    stopPupilProps()
  }

  const hide = () => {
    stopAll()
    setSmileProps({
      to: {...noSmile}
    })
    setEyeProps({
      to: closed,
      onRest: () => {}
    })
  }

  const show = () => {
    stopAll()
    setSmileProps({
      to: smile,
    })
    setEyeProps({...blink, delay: 0})
  }

  return (
    <svg className="face" width="72px" height="72px" viewBox="0,0 100,100"
      onMouseEnter={() => hide()}
      onMouseLeave={() => show()}
    >
      <circle cx="50" cy="50" r="50" />
      <g className="eyes">
        <g className="left eye">
          <animated.path style={eyeProps} d="M50,58 C55.5,58 60.5,55.5 65,50.5 C60.5,45.5 55.5,43 50,43 C44.5,43 39.5,45.5 35,50.5 C39.5,55.5 44.5,58 50,58 Z" />
          <animated.circle style={pupilProps} cx="50" cy="50.5" r="6" />
        </g>
        <g className="right eye">
          <animated.path style={eyeProps} d="M50,58 C55.5,58 60.5,55.5 65,50.5 C60.5,45.5 55.5,43 50,43 C44.5,43 39.5,45.5 35,50.5 C39.5,55.5 44.5,58 50,58 Z" />
          <animated.circle style={pupilProps} cx="50" cy="50.5" r="6" />
        </g>
      </g>
      <g className="smile">
        <animated.path vectorEffect="non-scaling-stroke" style={smileProps} d="M35,43 C35,51.2842712 41.7157288,58 50,58 C58.2842712,58 65,51.2842712 65,43" />
      </g>
    </svg>
  )
}

export default Eye

