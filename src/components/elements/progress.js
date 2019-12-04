import classNames from "classnames"
import React, { useState, useEffect, useRef } from "react"
import PropTypes from 'prop-types';

const Progress = ({ diameter, duration, autoStart }) => {
  const RADIUS = 50

  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState(autoStart ? Date.now() : 0)
  const [progress, setProgress] = useState(0)
  const requestAnimRef = useRef()


  const getProgress = () => {
    const elapsedTime = startTime ? Date.now() - startTime : 0
    const progress = (elapsedTime / duration).toPrecision(3)
    return progress >= 1 ? 1 : progress
  }

  const stopTimer = () => {
    cancelAnimationFrame(requestAnimRef.current)
  }

  const updateProgress = () => {
    const progress = getProgress()
    if (progress < 1) {
      setProgress(progress)
      requestAnimRef.current = requestAnimationFrame(updateProgress)
    } else {
      stopTimer()
    }
  }

  useEffect(() => {
    requestAnimRef.current = requestAnimationFrame(updateProgress)
    return () => stopTimer()
  }, [])

  const getPath = () => {
    const rad = progress * (2 * Math.PI)
    const x = RADIUS + (Math.sin(rad) * -RADIUS)
    const y = RADIUS + (Math.cos(rad) * -RADIUS)
    const mid = (rad < Math.PI) ? 1 : 0
    return `M ${RADIUS}, ${RADIUS} v -${RADIUS} A ${RADIUS},${RADIUS} 1 ${mid} 1 ${x},${y} z`
  }

  return (
    <svg width={diameter} viewBox={`0,0 ${RADIUS * 2},${RADIUS * 2}`}>
      <path d={getPath()} />
    </svg>
  )
}

Progress.defaultProps = {
  diameter: 100,
  duration: 10000,
  autoStart: true,
};

Progress.propTypes = {
  diameter: PropTypes.number,
  duration: PropTypes.number,
  autoStart: PropTypes.bool,
};

export default Progress
