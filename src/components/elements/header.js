import { Link } from 'gatsby';
import React from 'react';
import Controls from '../tools/controls';
import './header.css';

const Header = () => (
  <header>
    <div className="logo">
      <Link to="/">
        <svg width="72px" height="72px" viewBox="0,0 100,100">
          <circle cx="50" cy="50" r="50" />
        </svg>
      </Link>
    </div>
    <div className="title">
      <h1>
        <Link to="/me">
          Daniel Matarazzo
        </Link>
      </h1>
      <div className="controls">
        <Controls />
      </div>
    </div>
  </header>
);

export default Header;
