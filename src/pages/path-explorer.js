import React, { useRef, useState, useEffect } from 'react';
import shortId from 'shortid';
import classNames from 'classnames';
import SEO from '../components/tools/seo';
import { parse, commandCatalog, parameterCatalog } from '../components/tools/path-explorer/path-explorer';

const PathExplorer = () => {
  const dataRef = useRef(null);
  const svgRef = useRef(null);

  const [viewBox, setViewBox] = useState('0 0 0 0');
  const [pathData, setPathData] = useState('M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30 Q 90,60 50,90 Q 10,60 10,30 z');
  const [activeCommand, setActiveCommand] = useState(1);

  const updateBBox = () => {
    if (svgRef) {
      const {
        x, y, width, height,
      } = svgRef.current.getBBox();
      setViewBox(`${x - 5} ${y - 5} ${width + 10} ${height + 10}`);
    }
  };

  const updatePathData = () => {
    const newData = dataRef.current.value;
    setPathData(newData);
  };

  useEffect(() => {
    updateBBox();
  }, [pathData]);

  const parsed = parse(pathData);
  const isolated = parsed.commands.map((command) => command.isolatedCommandString);
  const isolatedPaths = isolated.flatMap((command, index) => {
    const isActive = activeCommand === index;
    const className = classNames({ active: isActive });
    return (<path markerStart="url(#point-marker-start)" markerEnd="url(#point-marker-end)" key={index} d={command} className={className} fill="none" />);
  });

  const controlUI = parsed.commands.flatMap((command, commandIndex) => {
    const { startEnd, controlPoints } = command;
    if (commandIndex === 0) return null;
    const controlLinesUI = !controlPoints ? [] : controlPoints.map(([x1, y1], controlIndex) => {
      const [x2, y2] = startEnd[controlIndex];
      return (
        <line
          markerStart="url(#control-marker)"
          markerEnd=""
          className="control-line"
          x1={x1} y1={y1} x2={x2} y2={y2} key={shortId()}
        />
    );
    });
    const isActive = activeCommand === commandIndex;
    const className = classNames('command-controls', { active: isActive });
    return (
      <g className={className} key={shortId()}>
        <g className="control-lines">{controlLinesUI}</g>
      </g>
    );
  });

  const commandList = parsed.commands.map((command, commandIndex) => {
    const genericCommand = commandCatalog[command.code];
    const parameterList = genericCommand.parameters.map((param, parameterIndex) => {
      const value = command.parameters[parameterIndex];
      const paramDescription = parameterCatalog[param];
      const isActive = activeCommand === parameterIndex;
      const className = classNames('parameter-list', { active: isActive });
      return (
        <li
          key={shortId()}
          onMouseEnter={() => setActiveCommand(commandIndex)}
          className={className}
        >
          <span className="param-value">
            <span className="param-name">
              {param}
            </span>
            <span className="param-value">
              {value}
            </span>
          </span>
          <span className="param-description">
            {paramDescription}
          </span>
        </li>
      );
    });
    const sublist = <ul className="parameter-list">{parameterList}</ul>;
    const isActive = activeCommand === commandIndex;
    const className = classNames('command', { active: isActive });
    return (
      <li className={className} key={shortId()}>
        <span className="command-code">
          {command.code}
        </span>
        <span className="command-description">
          {genericCommand.description}
        </span>
        {sublist}
      </li>
    );
  });

  return (
    <div>
      <SEO title="SVG Path Explorer" />
      <div className="path-explorer">
        <div className="command-list">
          <label htmlFor="path-command">Path data:</label>
          <textarea id="path-command" defaultValue={pathData} ref={dataRef} onChange={updatePathData} />
          <ul>
            {commandList}
          </ul>
        </div>
        <div className="path-preview">
          <div className="original">
            <svg width="100%" viewBox={viewBox}>
              <path ref={svgRef} d={parsed.parsedData} />
            </svg>
          </div>
          <div className="exploded">
            <svg width="100%" viewBox={viewBox}>
              <defs>
                <marker
                  id="point-marker-start"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="1%"
                  markerUnit="strokeWidth"
                  orient="auto"
                >
                  <circle cx="5" cy="5" r="5" />
                  <circle cx="5" cy="5" r="3" fill="white" />
                </marker>
                <marker
                  id="point-marker-end"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="1%"
                  markerUnit="strokeWidth"
                >
                  <circle cx="5" cy="5" r="5" />
                  <circle cx="5" cy="5" r="3" fill="white" />
                  <circle cx="5" cy="5" r="1.5"  />
                </marker>
                <marker
                  id="control-marker"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="1%"
                  markerUnit="strokeWidth"
                  orient="auto"
                >
                  <rect x="0" y="0" width="10" height="10" />
                  <rect x="2" y="2" width="6" height="6" fill="white" />
                </marker>
              </defs>
              <g ref={svgRef}>
                {controlUI}
                {isolatedPaths}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathExplorer;
