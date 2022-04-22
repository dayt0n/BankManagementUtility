import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CreateUserAccountPage from './pages/CreateUserAccountPage';

import UserSummaryPage from './pages/User/UserSummaryPage';
import TransferFundsPage from './pages/User/TransferFundsPage';
import PayBillPage from './pages/User/PayBillPage';
import EditUserAccountPage from './pages/User/EditUserAccountPage';

import TellerSummaryPage from './pages/Teller/TellerSummaryPage';
import TellerCreateNewAccountPage from './pages/Teller/TellerCreateNewAccountPage';
import TellerUserSummaryPage from './pages/Teller/TellerUserSummaryPage';
import TellerEditUserAccountPage from './pages/Teller/TellerEditUserAccountPage';
import TellerOpenUserAccountPage from './pages/Teller/TellerOpenUserAccountPage';
import TellerTransferFundsPage from './pages/Teller/TellerTransferFundsPage';
import TellerWithdrawFundsPage from './pages/Teller/TellerWithdrawFundsPage';
import TellerPayABillPage from './pages/Teller/TellerPayABillPage';
import TellerUserInterestInfo from './pages/Teller/TellerUserInterestInfo';
import TellerDeleteUserAccountPage from './pages/Teller/TellerDeleteUserAccountPage';

import AdminSummaryPage from './pages/Admin/AdminSummaryPage';
import AdminUserSummaryPage from './pages/Admin/AdminUserSummaryPage';
import AdminCreateUserAccountPage from './pages/Admin/AdminCreateUserAccountPage';
import AdminEditUserAccountPage from './pages/Admin/AdminEditUserAccountPage';
import AdminOpenUserAccountPage from './pages/Admin/AdminOpenUserAccountPage';
import AdminTransferFundsPage from './pages/Admin/AdminTransferFundsPage';
import AdminWithdrawFundsPage from './pages/Admin/AdminWithdrawFundsPage';
import AdminPayABillPage from './pages/Admin/AdminPayABillPage';
import AdminUserInterestInfo from './pages/Admin/AdminUserInterestInfo';
import AdminDeleteUserAccountPage from './pages/Admin/AdminDeleteUserAccountPage';
import AdminCreateTellerAccountPage from './pages/Admin/AdminCreateTellerAccountPage';
import AdminDeleteTellerAccountPage from './pages/Admin/AdminDeleteTellerAccountPage';
import AdminEditTellerAccountPage from './pages/Admin/AdminEditTellerAccountPage';

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
                <Route path='/teller/user/edit-account' element={<TellerEditUserAccountPage />}></Route>
                <Route path='/teller/user/open-account' element={<TellerOpenUserAccountPage />}></Route>
                <Route path='/teller/user/transfer' element={<TellerTransferFundsPage />}></Route>
                <Route path='/teller/user/withdraw' element={<TellerWithdrawFundsPage />}></Route>
                <Route path='/teller/user/pay-bill' element={<TellerPayABillPage />}></Route>
                <Route path='/teller/user/interest' element={<TellerUserInterestInfo />}></Route>
                <Route path='/teller/user/delete-account' element={<TellerDeleteUserAccountPage />}></Route>

                <Route path='/admin/overview' element={<AdminSummaryPage />}></Route>
                <Route path='/admin/user/summary' element={<AdminUserSummaryPage />}></Route>
                <Route path='/admin/user/create-account' element={<AdminCreateUserAccountPage />}></Route>
                <Route path='/admin/user/edit-account' element={<AdminEditUserAccountPage />}></Route>
                <Route path='/admin/user/open-account' element={<AdminOpenUserAccountPage />}></Route>
                <Route path='/admin/user/transfer' element={<AdminTransferFundsPage />}></Route>
                <Route path='/admin/user/withdraw' element={<AdminWithdrawFundsPage />}></Route>
                <Route path='/admin/user/pay-bill' element={<AdminPayABillPage />}></Route>
                <Route path='/admin/user/interest' element={<AdminUserInterestInfo />}></Route>
                <Route path='/admin/user/delete-account' element={<AdminDeleteUserAccountPage />}></Route>
                <Route path='/admin/teller/create-account' element={<AdminCreateTellerAccountPage />}></Route>
                <Route path='/admin/teller/delete-account' element={<AdminDeleteTellerAccountPage />}></Route>
                <Route path='/admin/teller/edit-account' element={<AdminEditTellerAccountPage />}></Route>
            </Routes>
        </div>
    );
}

export default Main;