import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import '../styles/Analytics.css';
import { formatCurrency } from '../utils/formatNumber';

const Analytics = () => {
  const [result, setResult] = useState({
    coffeeResult: 0,
    iceTeaResult: 0,
    plumResult: 0,
    fruitsCupResult: 0,
    donationResult: 0,
  });

  const getMenuCounts = async type => {
    const { data, error } = await supabase.from('orders').select('order');

    if (error) console.error(error.message);

    const order = data.map(item => {
      return JSON.parse(item.order);
    });

    const counts = order.reduce((totalCount, item) => {
      const count = item.reduce((counts, item) => {
        return item.name == type ? counts + item.quantity : counts;
      }, 0);
      return totalCount + count;
    }, 0);

    return counts;
  };

  const getDonationCounts = async () => {
    const { data, error } = await supabase.from('orders').select('donation');

    if (error) console.error(error.message);

    return await data.reduce((totalDonation, item) => totalDonation + item.donation, 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      const coffeeResult = await getMenuCounts('커피');
      const iceTeaResult = await getMenuCounts('아이스티');
      const plumResult = await getMenuCounts('매실');
      const fruitsCupResult = await getMenuCounts('과일컵');
      const donationResult = await getDonationCounts();

      setResult({ coffeeResult, iceTeaResult, plumResult, fruitsCupResult, donationResult });
    };

    fetchData();
    console.log(result);
  }, []);

  return (
    <div className='analytics-container'>
      <h2>판매 분석</h2>

      <div className='menu-stats'>
        <h3>메뉴별 판매 현황</h3>
        <div className='menu-grid'>
          <div className='menu-item'>
            <h4>커피</h4>
            <p>판매량: {result.coffeeResult}잔</p>
            <p>판매액: {formatCurrency(result.coffeeResult * 3000)}</p>
          </div>
          <div className='menu-item'>
            <h4>아이스티</h4>
            <p>판매량: {result.iceTeaResult}잔</p>
            <p>판매액: {formatCurrency(result.iceTeaResult * 3000)}</p>
          </div>
          <div className='menu-item'>
            <h4>매실</h4>
            <p>판매량: {result.plumResult}잔</p>
            <p>판매액: {formatCurrency(result.plumResult * 4000)}</p>
          </div>
          <div className='menu-item'>
            <h4>과일컵</h4>
            <p>판매량: {result.fruitsCupResult}개</p>
            <p>판매액: {formatCurrency(result.fruitsCupResult * 4000)}</p>
          </div>
        </div>
      </div>

      <div className='total-stats'>
        <h3>전체 판매 현황</h3>
        <div className='total-grid'>
          <div className='total-item'>
            <h4>총 판매량</h4>
            <p>
              {result.coffeeResult +
                result.iceTeaResult +
                result.plumResult +
                result.fruitsCupResult}
              개
            </p>
          </div>
          <div className='total-item'>
            <h4>총 판매액</h4>
            <p>
              {formatCurrency(
                result.coffeeResult * 3000 +
                  result.iceTeaResult * 3000 +
                  result.plumResult * 4000 +
                  result.fruitsCupResult * 4000
              )}
            </p>
          </div>
          <div className='total-item'>
            <h4>총 기부금</h4>
            <p>{formatCurrency(result.donationResult)}</p>
          </div>
          <div className='total-item'>
            <h4>총 수입</h4>
            <p>
              {formatCurrency(
                result.coffeeResult * 3000 +
                  result.iceTeaResult * 3000 +
                  result.plumResult * 4000 +
                  result.fruitsCupResult * 4000 +
                  result.donationResult
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
