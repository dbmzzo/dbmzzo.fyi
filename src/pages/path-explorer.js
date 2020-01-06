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

  const commandList = parsed.commands.map((command) => {
    const genericCommand = commandCatalog[command.code];
    const parameterList = genericCommand.parameters.map((param, parameterIndex) => {
      const value = command.parameters[parameterIndex];
      const paramDescription = parameterCatalog[param];
      const isActive = activeCommand === parameterIndex;
      const className = { active: isActive };
      return (
        <li key={shortId()} className={className}>
          <div>
            {param}
            {value}
          </div>
          <div>
            {paramDescription}
          </div>
        </li>
      );
    });
    const sublist = <ul>{parameterList}</ul>;
    return (
      <li key={shortId()}>
        <span>
          {command.code}
        </span>
        <span>
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
          <p>{pathData}</p>
          <p>{parsed.viewBox.join(' ')}</p>
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
              {isolatedPaths}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PathExplorer;
