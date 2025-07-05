import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { formatNumber, formatCurrency } from '../utils/formatNumber';
import '../styles/Header.css';

const Header = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const getTotalQuantityAndSales = async () => {
      try {
        const { data: orders, error } = await supabase.from('orders').select('*');

        if (error) {
          console.error('Supabase error:', error);
          return;
        }

        setTotalQuantity(orders.length);

        const totalAmountAll = orders.reduce((acc, orderObj) => {
          const items = JSON.parse(orderObj.order);
          const orderTotal = items.reduce((sum, item) => sum + item.total, 0);
          return acc + orderTotal;
        }, 0);

        setTotalSales(totalAmountAll);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    getTotalQuantityAndSales();
  }, []);

  return (
    <header id='header'>
      <h1 id='title'>LIB Retreat Order Summary</h1>
      <div className='info'>
        <div id='total-quantity'>총 수량: {formatNumber(totalQuantity)}개</div>
        <div id='total-sales'>총 매출: {formatCurrency(totalSales)}</div>
      </div>
    </header>
  );
};

export default Header;
