import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import BidderInterface from './components/BidderInterface';
import DisplayScreen from './components/DisplayScreen';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/bid/:auctionId" element={<BidderInterface />} />
        <Route path="/display/:auctionId" element={<DisplayScreen />} />
      </Routes>
    </div>
  );
}

export default App;
