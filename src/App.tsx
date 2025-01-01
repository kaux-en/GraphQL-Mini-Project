import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import GetUserInfo from './components/UserInfo.tsx';
import CreatePost from './components/Mutations.tsx';

function App() {
  return (
    <div className="App">
      
      <Routes>
        <Route path='/' element={<CreatePost />} />
        <Route path='/:id' element={<GetUserInfo />} />
      </Routes>
    </div>
  );
}

export default App;
