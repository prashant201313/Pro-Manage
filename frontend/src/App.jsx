import React from 'react';
import './App.css';
import { Outlet } from 'react-router-dom';
import Notification from './components/Notification';

function App() {

  return (
    <div>
      <Outlet />
      <Notification />
    </div>
  )
}

export default App
