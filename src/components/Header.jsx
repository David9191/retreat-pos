import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { formatNumber, formatCurrency } from '../utils/formatNumber';
import '../styles/Header.css';

const Header = () => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    const getTotalQuantityAndSales = async () => {
      try {
        const { data: orders, error } = await supabase
          .from('orders')
          .select('order')
          .gte('created_at', today + 'T00:00:00')
          .lt('created_at', today + 'T23:59:59');

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
      <a href='http://localhost:5173/retreat-app/analytics' id='to-analytics'>
        통계
      </a>

      <h1 id='title'>
        <a href='http://localhost:5173'>LIB Retreat Order Summary</a>
      </h1>
      <div className='info'>
        <div id='total-quantity'>총 수량: {formatNumber(totalQuantity)}개</div>
        <div id='total-sales'>총 매출: {formatCurrency(totalSales)}</div>
      </div>
    </header>
  );
};

export default Header;
