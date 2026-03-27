import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TitleDetail from './pages/TitleDetail';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Recommendations from './pages/Recommendations';
import './App.css';

const DEFAULT_USER_ID = '11111111-1111-1111-1111-111111111111';

function App(): React.ReactElement {
  const [userId, setUserId] = useState<string>(DEFAULT_USER_ID);

  return (
    <Router>
      <div className="app">
        <Navbar userId={userId} setUserId={setUserId} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home userId={userId} />} />
            <Route path="/title/:id" element={<TitleDetail userId={userId} />} />
            <Route path="/profile" element={<Profile userId={userId} />} />
            <Route path="/search" element={<Search />} />
            <Route path="/recommendations" element={<Recommendations userId={userId} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
