import React from 'react';
import './orbit.css';

class Orbit extends React.Component {
  constructor(props) {
    super(props);
    this.pathRef = null;

    this.setPathRef = (element) => {
      this.pathRef = element;
    };
  }

  render() {
    return (
      <div className="orbit">
        <svg className="planet" width="72px" height="72px" viewBox="0 0 88 88">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-19.000000, -19.000000)">
              <g transform="translate(19.000000, 63.000000)" />
              <g transform="translate(63.000000, 63.000000) rotate(45.000000) translate(-63.000000, -63.000000) translate(19.000000, 19.000000)">
                <circle fill="#24282D" cx="44" cy="44" r="44" />
              </g>
            </g>
          </g>
        </svg>
      </div>
    );
  }
}

export default Orbit;
