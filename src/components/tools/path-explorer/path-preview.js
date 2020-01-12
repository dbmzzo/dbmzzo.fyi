import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const PathPreview = ({ viewBox }) => {
  const svgRef = useRef(null);
  const updateBBox = () => {
    if (svgRef) {
      const {
        x, y, width, height,
      } = svgRef.current.getBBox();
      setViewBox(`${x - 5} ${y - 5} ${width + 10} ${height + 10}`);
    }
  };

  useEffect(() => {
    updateBBox();
  }, []);


  return (
    <div className="path-preview">
      <div className="original">
        <svg width="100%" viewBox={viewBox}>
          <path ref={svgRef} d={parsed.parsedData} />
        </svg>
      </div>
      <div className="exploded">
        <svg width="100%" viewBox={viewBox}>
          <defs>
            <symbol id="startEndPoint" width="10%" height="10%">
              <rect x="0" y="0" width="10" height="10" />
            </symbol>
            <symbol id="controlPoint" width="10%" height="10%">
              <circle cx="5" cy="5" r="5" />
            </symbol>
          </defs>
          <g ref={svgRef}>
            {isolatedPaths}
            <g className="control-ui">
              {controlUI}
            </g>
          </g>

        </svg>
      </div>
    </div>
  );
};

PathPreview.defaultProps = {
  commands: [],
};

PathPreview.propTypes = {
  commands: PropTypes.arrayOf,
};

export default PathPreview;
