import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import Projects from './pages/Projects';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Router>
  );
};

export default App; 