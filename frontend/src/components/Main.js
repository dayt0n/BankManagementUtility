import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import TestPage from './pages/TestPage';
import CreateUserAccountPage from './pages/CreateUserAccountPage';
import EditUserAccountPage from './pages/User/EditUserAccountPage';
import AdminCreateTellerAccountPage from './pages/Admin/AdminCreateTellerAccountPage';
import TransferFundsPage from './pages/User/TransferFundsPage';
import PayBillPage from './pages/User/PayBillPage';
import TellerTransferFundsPage from './pages/Teller/TellerTransferFundsPage';
import TellerCreateNewAccountPage from './pages/Teller/TellerCreateNewAccountPage';
import UserSummaryPage from './pages/User/UserSummaryPage';
import TellerSummaryPage from './pages/Teller/TellerSummaryPage';
import AdminSummaryPage from './pages/Admin/AdminSummaryPage';
import TellerUserSummaryPage from './pages/Teller/TellerUserSummaryPage';
import AdminUserSummaryPage from './pages/Admin/AdminUserSummaryPage';

const Main = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<HomePage />}></Route>
            <Route path='/create-user-account' element={<CreateUserAccountPage />}></Route>

            <Route path='/user/summary' element={<UserSummaryPage />}></Route>
            <Route path='/user/transfer' element={<TransferFundsPage />}></Route>
            <Route path='/user/pay-bill' element={<PayBillPage />}></Route>
            <Route path='/user/edit-account' element={<EditUserAccountPage />}></Route>

            <Route path='/teller/overview' element={<TellerSummaryPage />}></Route>
            <Route path='/teller/user/create-account' element={<TellerCreateNewAccountPage />}></Route>
            <Route path='/teller/user/summary' element={<TellerUserSummaryPage />}></Route>
            <Route path='/teller/user/view-account' element={<TestPage />}></Route>
            <Route path='/teller/user/transfer' element={<TellerTransferFundsPage />}></Route>
            <Route path='/teller/user/delete-account' element={<TestPage />}></Route>

            <Route path='/admin/overview' element={<AdminSummaryPage />}></Route>
            <Route path='/admin/user/summary' element={<AdminUserSummaryPage />}></Route>
            <Route path='/admin/user/view-account' element={<TestPage />}></Route>
            <Route path='/admin/teller/create-account' element={<AdminCreateTellerAccountPage />}></Route>
            <Route path='/admin/teller/delete-account' element={<TestPage />}></Route>
            <Route path='/admin/teller/edit-account' element={<TestPage />}></Route>
        </Routes>
    </div>
  );
}

export default Main;