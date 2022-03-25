import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import CreateUserAccountPage from './pages/CreateUserAccountPage';
import EditUserAccountPage from './pages/EditUserAccountPage';
import CreateTellerAccountPage from './pages/CreateTellerAccountPage';

const Main = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='/create-user-account' element={<CreateUserAccountPage />}></Route>
            <Route path='/user/summary' element={<TestPage />}></Route>
            <Route path='/user/transfer' element={<TestPage />}></Route>
            <Route path='/user/pay-bill' element={<TestPage />}></Route>
            <Route path='/user/edit-account' element={<EditUserAccountPage />}></Route>
            <Route path='/user/open-account' element={<TestPage />}></Route>
            <Route path='/teller/overview' element={<TestPage />}></Route>
            <Route path='/teller/user/create-account' element={<TestPage />}></Route>
            <Route path='/teller/user/summary' element={<TestPage />}></Route>
            <Route path='/teller/user/view-account' element={<TestPage />}></Route>
            <Route path='/teller/user/transfer' element={<TestPage />}></Route>
            <Route path='/teller/user/delete-account' element={<TestPage />}></Route>
            <Route path='/admin/overview' element={<TestPage />}></Route>
            <Route path='/admin/user/view-account' element={<TestPage />}></Route>
            <Route path='/admin/teller/create-account' element={<CreateTellerAccountPage />}></Route>
            <Route path='/admin/teller/delete-account' element={<TestPage />}></Route>
            <Route path='/admin/teller/edit-account' element={<TestPage />}></Route>
        </Routes>
    </div>
  );
}

export default Main;