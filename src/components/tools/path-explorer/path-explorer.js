const commandCatalog = {
  M: {
    description: 'move to',
    parameters: ['x', 'y'],
  },
  L: {
    description: 'line to',
    parameters: ['x', 'y'],
  },
  H: {
    description: 'horizontal line to',
    parameters: ['x'],
  },
  V: {
    description: 'vertical line to',
    parameters: ['y'],
  },
  C: {
    description: 'cubic bézier curve',
    parameters: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
  },
  S: {
    description: 'smooth cubic bézier curve',
    parameters: ['x2', 'y2', 'x', 'y'],
  },
  Q: {
    description: 'quadratic bézier curve',
    parameters: ['x1', 'y1', 'x', 'y'],
  },
  T: {
    description: 'smooth quadratic bézier curve',
    parameters: ['x', 'y'],
  },
  A: {
    description: 'elliptical arc curve',
    parameters: ['rx', 'ry', 'angle', 'large-arc-flag', 'sweep-flag', 'x', 'y'],
  },
  Z: {
    description: 'close path',
    parameters: [],
  },
};

const parameterCatalog = {
  x: 'x coordinate',
  y: 'y coordinate',
  x1: 'first control point x coordinate',
  y1: 'first control point y coordinate',
  x2: 'second control point x coordinate',
  y2: 'second control point y coordinate',
  rx: 'first ellipse radius',
  ry: 'second ellipse radius',
  angle: 'degrees of rotation relative to x axis',
  'large-arc-flag': 'small (0) or large (1) arc',
  'sweep-flag': 'anticlockwise (0) or clockwise (1) arc',
};

// simple array chunking function
const getChunks = (array, size) => {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) chunked.push(array.slice(i, i + size));
  return chunked;
};

// chunk parameters into individual groups
const getExpandedParameters = (code, parameters) => {
  const genericCommand = commandCatalog[code];
  const parameterCount = genericCommand.parameters.length;
  const chunked = getChunks(parameters, parameterCount);
  switch (parameterCount) {
    case 0:
      return [];
    default:
      return chunked.map((command) => {
        const expanded = command.flatMap((value) => value);
        return expanded;
      });
  }
};

// expand multiple command shorthand into individual commands
const getParsedCommands = (rawCommandStrings) => rawCommandStrings.flatMap((rawCommandString) => {
  const rawCode = rawCommandString.match(/[A-Z]/i)[0];
  const code = rawCode.toUpperCase();
  const isAbsolute = rawCode === code;
  const subsequentCode = code === 'M' ? 'L' : code;
  const matches = rawCommandString.match(/-?\d+(\.\d+)?/g);
  const parameters = matches || [];
  const expanded = getExpandedParameters(code, parameters);
  switch (expanded.length) {
    case 0:
      return {
        code, parameters, isAbsolute, rawCommandString,
      };
    default:
      return expanded.map((params, index) => {
        const currentCode = index > 0 ? subsequentCode : code;
        return {
          code: currentCode, parameters: params, isAbsolute, rawCommandString,
        };
      });
  }
});

const getIsPathStart = (accumulator, command, index) => {
  const isPrevStart = index === 0 ? false : accumulator[index - 1].isPathStart;
  const prevDraws = index === 0 ? false : accumulator[index - 1].doesDraw;
  switch (command.code) {
    case 'M':
      return false;
    default:
      return !isPrevStart && !prevDraws;
  }
};

const getCurrentPathStart = (accumulator, index) => {
  for (let i = index - 1; i >= 0; i -= 1) {
    const current = accumulator[i];
    if (current.isPathStart) {
      return current.startEnd[0];
    }
  }
  return [0, 0];
};

const getReflectedEndControl = (command) => {
  const { controlPoints } = command;
  const endControl = controlPoints[controlPoints.length - 1];
  const start = command.startEnd[1];
  const delta = [start[0] - endControl[0], start[1] - endControl[1]];
  return [start[0] + delta[0], start[1] + delta[1]];
};

const getStartEndPoints = (accumulator, command, index) => {
  const { parameters, isAbsolute } = command;
  const prevEnd = index === 0 ? [0, 0] : accumulator[index - 1].startEnd[1];
  switch (command.code) {
    case 'M':
    case 'L':
    case 'C':
    case 'S':
    case 'Q':
    case 'T':
    case 'A': {
      const paramLength = parameters.length;
      const thisEnd = [
        parseFloat(parameters[paramLength - 2]),
        parseFloat(parameters[paramLength - 1]),
      ];
      switch (isAbsolute) {
        case true:
          return [
            prevEnd,
            [thisEnd[0], thisEnd[1]],
          ];
        default:
          return [
            prevEnd,
            [prevEnd[0] + thisEnd[0], prevEnd[1] + thisEnd[1]],
          ];
      }
    }
    case 'H': {
      switch (isAbsolute) {
        case true:
          return [
            prevEnd,
            [parseFloat(parameters[0]), prevEnd[1]],
          ];
        default:
          return [
            prevEnd,
            [parseFloat(parameters[0]) + prevEnd[0], prevEnd[1]],
          ];
      }
    }
    case 'V': {
      switch (isAbsolute) {
        case true:
          return [
            prevEnd,
            [prevEnd[0], parseFloat(parameters[0])],
          ];
        default:
          return [
            prevEnd,
            [prevEnd[0], parseFloat(parameters[0]) + prevEnd[1]],
          ];
      }
    }
    case 'Z': {
      const thisEnd = getCurrentPathStart(accumulator, index);
      return [
        prevEnd,
        thisEnd,
      ];
    }
    default: {
      return [
        [0, 0],
        [0, 0],
      ];
    }
  }
};

const getControlPoints = (accumulator, command, index) => {
  const { code, parameters, isAbsolute } = command;
  const [start] = getStartEndPoints(accumulator, command, index);
  const previousCommand = index === 0 ? null : accumulator[index - 1];
  switch (code) {
    case 'S': {
      const first = previousCommand.controlPoints
        ? getReflectedEndControl(previousCommand)
        : start;
      switch (isAbsolute) {
        case true: {
          const second = [
            parseFloat(parameters[0]),
            parseFloat(parameters[1]),
          ];
          return [first, second];
        }
        default: {
          const second = [
            parseFloat(parameters[0]) + start[0],
            parseFloat(parameters[1]) + start[1],
          ];
          return [first, second];
        }
      }
    }
    case 'C': {
      const first = [
        parseFloat(parameters[0]),
        parseFloat(parameters[1]),
      ];
      const second = [
        parseFloat(parameters[2]),
        parseFloat(parameters[3]),
      ];
      switch (isAbsolute) {
        case true:
          return [first, second];
        default:
          return [
            [start[0] + first[0], start[1] + first[1]],
            [start[0] + second[0], start[1] + second[1]],
          ];
      }
    }
    case 'Q': {
      const first = [
        parseFloat(parameters[0]),
        parseFloat(parameters[1]),
      ];
      switch (isAbsolute) {
        case true: {
          return [first];
        }
        default: {
          return [first];
        }
      }
    }
    case 'T': {
      const first = previousCommand.controlPoints
        ? getReflectedEndControl(previousCommand)
        : start;
      switch (isAbsolute) {
        case true: {
          const second = [
            parseFloat(parameters[0]),
            parseFloat(parameters[1]),
          ];
          return [first];
        }
        default: {
          const second = [
            parseFloat(parameters[0]) + start[0],
            parseFloat(parameters[1]) + start[1],
          ];
          return [first];
        }
      }
    }
    default: {
      return null;
    }
  }
};

const getCommandString = ((command) => {
  const {
    code, parameters, isAbsolute,
  } = command;
  const realCode = isAbsolute ? code : code.toLowerCase();
  return parameters.reduce((pathString, param, index) => {
    const space = index === parameters.length - 1 ? '' : ' ';
    return pathString.concat(param, space);
  }, realCode);
});

const getIsolatedCommandString = ((command) => {
  const {
    code, parameters, controlPoints, startEnd,
  } = command;
  switch (code) {
    case 'L':
    case 'H':
    case 'V':
    case 'Z': {
      return `M${startEnd[0].join(',')} L${startEnd[1].join(',')}`;
    }
    case 'C':
    case 'S': {
      return `M${startEnd[0].join(',')} C${controlPoints[0].join(',')} ${controlPoints[1].join(',')} ${startEnd[1].join(',')}`;
    }
    case 'Q':
    case 'T': {
      return `M${startEnd[0].join(',')} Q${controlPoints[0].join(',')} ${startEnd[1].join(',')}`;
    }
    case 'A': {
      return `M${startEnd[0].join(',')} A${parameters.slice(0, 5).join(' ')} ${startEnd[1].join(',')}`;
    }
    default:
      return command.commandString;
  }
});

const getExpandedCommands = (commands) => commands.reduce((accumulator, command, index) => {
  const startEnd = getStartEndPoints(accumulator, command, index);
  const controlPoints = getControlPoints(accumulator, command, index);
  const isPathStart = getIsPathStart(accumulator, command, index);
  const commandString = getCommandString(command);
  const { code, parameters } = command;
  const doesDraw = command.code !== 'M' && command.code !== 'Z';
  const isolatedCommandString = getIsolatedCommandString({
    code, parameters, controlPoints, startEnd, commandString,
  });
  return accumulator.concat({
    code,
    commandString,
    isolatedCommandString,
    controlPoints,
    doesDraw,
    isPathStart,
    parameters,
    startEnd,
  });
}, []);

// break data string into individual command strings
const getRawCommandStrings = (data) => {
  const strippedCommas = data.replace(/[\s,]+/g, ' ');
  const matches = strippedCommas ? strippedCommas.match(/[A-Z\s\S]+?(?=[A-Z]|$)/gi) : [];
  return matches.length ? matches.map((command) => command.trim()) : [];
};

const getCalculatedViewBox = ((commands) => commands.reduce((accumulator, command) => {
  const { startEnd } = command;
  return accumulator.map((current, index) => {
    switch (index) {
      case 0:
        return Math.min(startEnd[0][0], current);
      case 1:
        return Math.min(startEnd[0][1], current);
      case 2:
        return Math.max(startEnd[1][0], current);
      case 3:
        return Math.max(startEnd[1][1], current);
      default:
        return 0;
    }
  });
}, [0, 0, 0, 0]));

const getParsedData = (commands) => commands.reduce((accumulator, command) => accumulator.concat(command.commandString), '');

const parse = (data) => {
  const rawCommandStrings = getRawCommandStrings(data);
  const parsedCommands = getParsedCommands(rawCommandStrings);
  const commands = getExpandedCommands(parsedCommands);
  const parsedData = getParsedData(commands);
  const viewBox = getCalculatedViewBox(commands);
  return ({
    data,
    parsedData,
    commands,
    viewBox,
  });
};

module.exports = {
  parse,
  commandCatalog,
  parameterCatalog,
};
