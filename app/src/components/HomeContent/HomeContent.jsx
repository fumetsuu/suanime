import React from 'react';

import HeaderActionButton from './HeaderActionButton.jsx'
import CardsDisplay from './CardsDisplay.jsx'

const HomeContent = () => (
  <div className="home-content-wrapper">
    <div className="home-content">
    <div className="header-wrapper">
        <div className="home-header">
          Recent
        </div>
        <div className="spacer-horizontal"/>
        <HeaderActionButton/>
      </div>
      <CardsDisplay/>
    </div>
  </div>
);

export default HomeContent;
