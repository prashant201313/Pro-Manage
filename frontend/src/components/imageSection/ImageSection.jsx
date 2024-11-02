import React from 'react';
import "./imageSection.css";

export default function ImageSection() {
  return (
    <div className='imageSection'>
      <div className='logo'>
        <div className='circle'></div>
        <img src="./astronaut.png" alt="astronaut" />
      </div>
      <p>Welcome aboard my friend</p>
      <span>just a couple of clicks and we start</span>
    </div>
  );
}
