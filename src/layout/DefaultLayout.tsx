import React, { useState, ReactNode } from 'react';
import Header from '../components/includes/header';
import Footer from '../components/includes/footer';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ToastContainer } from 'react-toastify';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {

  return (
    <div>
      <Header />
      <div className="main_content_fluid">
        {children}
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default DefaultLayout;
