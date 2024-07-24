import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import RegisterLand from './pages/RegisterLand';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import BuyCredits from './pages/BuyCredits';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<Home />}></Route>
          <Route path='/registerLand' exact element={<RegisterLand />}></Route>
          <Route path='/buyCredits' exact element={<BuyCredits />}></Route>
          <Route path='/analytics' exact element={<Analytics />}></Route>
          <Route path='/settings' exact element={<Settings />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
