import React from 'react';
import { NavLink } from 'react-router-dom'

const Title = () => (
  <NavLink exact to="/" className="title">
    <span className="su-blue">SU</span> ANIME
  </NavLink>
);

export default Title;
