import MainLayout from '@/components/common';
import Addons from '@/routes/addons';
import AddAddon from '@/routes/addons/add-addon';
import Chalets from '@/routes/chalets';
import AddChalet from '@/routes/chalets/add-chalet';
import Customers from '@/routes/customers';
import CustomerDetails from '@/routes/customers/view-customer';
import Dashboard from '@/routes/home';
import Reservations from '@/routes/reservations';
import ReservationDetails from '@/routes/reservations/view-reservation';
import Rules from '@/routes/rules';
import AddRule from '@/routes/rules/add-rule';
import Transactions from '@/routes/transactions';
import TransactionDetails from '@/routes/transactions/view-transaction';
import { Route, Routes } from 'react-router-dom';

const Admin = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="chalets" element={<Chalets />} />
        <Route path="chalets/add-chalet" element={<AddChalet />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="reservations/view-reservation/:id" element={<ReservationDetails />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/view-customer/:id" element={<CustomerDetails />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="transactions/view-transaction/:id" element={<TransactionDetails />} />
        <Route path="rules" element={<Rules />} />
        <Route path="rules/add-rule" element={<AddRule />} />
        <Route path="addons" element={<Addons />} />
        <Route path="addons/add-addon" element={<AddAddon />} />
      </Routes>
    </MainLayout>
  );
};

export default Admin;
