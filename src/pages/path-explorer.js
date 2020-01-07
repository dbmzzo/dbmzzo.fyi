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
      const bb = svgRef.current.getBBox();
      setViewBox(`${bb.x - 5} ${bb.y - 5} ${bb.width + 10} ${bb.height + 10}`);
    }
  };

  const updatePathData = () => {
    const newData = dataRef.current.value;
    setPathData(newData);
  };

  useEffect(() => {
    updateBBox();
  });

  const parsed = parse(pathData);
  const isolated = parsed.commands.map((command) => command.isolatedCommandString);
  const isolatedPaths = isolated.flatMap((command, index) => {
    const isActive = activeCommand === index;
    const className = classNames({ active: isActive });
    return (<path key={index} d={command} className={className} fill="none" stroke="var(--pop-color)" />);
  });

  const controlUI = parsed.commands.flatMap((command, commandIndex) => {
    const { startEnd, controlPoints } = command;
    if (commandIndex === 0) return null;
    const size = 5;
    const startEndPointsUI = startEnd.map(([x, y], index) => {
      const isActive = activeCommand === commandIndex;
      const className = classNames('point', 'start-end', { active: isActive, start: index === 0, end: index === 1 });
      const x1 = x - (size / 2);
      const y1 = y - (size / 2);
      return (
        <rect
          className={className}
          x={x1}
          y={y1}
          width={size}
          height={size}
          key={shortId()}
        />
      );
    });
    const controlPointsUI = !controlPoints ? [] : controlPoints.map(([x, y]) => (<circle className="point control-point" cx={x} cy={y} r={size / 2} key={shortId()} />));
    const controlLinesUI = !controlPoints ? [] : controlPoints.map(([x1, y1], controlIndex) => {
      const [x2, y2] = startEnd[controlIndex];
      return (<line className="control-line" x1={x1} y1={y1} x2={x2} y2={y2} key={shortId()} />);
    });
    const isActive = activeCommand === commandIndex;
    const className = classNames('command-controls', { active: isActive });
    return (
      <g className={className} key={shortId()}>
        <g className="control-lines">{controlLinesUI}</g>
        <g className="start-end-points">{startEndPointsUI}</g>
        <g className="control-points">{controlPointsUI}</g>
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
        <li key={shortId()} onMouseEnter={() => setActiveCommand(commandIndex)} className={className}>
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
              <g ref={svgRef}>
                {isolatedPaths}
                <g className="control-ui">
                  {controlUI}
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathExplorer;
