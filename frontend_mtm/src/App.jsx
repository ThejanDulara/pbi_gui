import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layout';
import StartPage from './pages/StartPage';
import DashboardsPage from './pages/DashboardsPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Add ToastContainer here for global toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Layout>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/dashboards" element={<DashboardsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}