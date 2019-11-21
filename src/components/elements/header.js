import { Link } from 'gatsby';
import React from 'react';
import Eye from './eye';
import Controls from '../tools/controls';
import './header.css';

const Header = () => (
  <header>
    <div className="logo">
      <Link aria-label="Link to Home" to="/">
        <Eye />
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
