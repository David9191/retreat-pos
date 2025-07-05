import React from 'react';
import OrderList from '../components/OrderList';
import WaitList from '../components/WaitList';
import '../styles/Home.css';

const Home = () => {
  return (
    <div id='home-container'>
      <OrderList className='order-list' />
      <WaitList className='wait-completed-list' />
    </div>
  );
};

export default Home;
