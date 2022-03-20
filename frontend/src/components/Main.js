import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import CreateUserAccountPage from './pages/CreateUserAccountPage';

const Main = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='/test' element={<TestPage />}></Route>
            <Route path='/create-user-account' element={<CreateUserAccountPage />}></Route>
        </Routes>
    </div>
  );
}

export default Main;