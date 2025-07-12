import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { useOrderContext } from '../context/OrderContext';
import '../styles/WaitList.css';

const WaitList = () => {
  const [reservation, setReservation] = useState([]);
  const [waitList, setWaitList] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const { orderUpdateTrigger } = useOrderContext();

  const getOrders = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error.message);
        return;
      }
      setReservation(orders.filter(item => item.is_wait && item.is_reservation));
      setWaitList(orders.filter(item => item.is_wait && !item.is_reservation));
      setCompletedList(orders.filter(item => !item.is_wait));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, [orderUpdateTrigger]);

  const handleStatusBtnClick = async (e, isCompletedCancel = false) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update(isCompletedCancel ? { is_wait: true } : { is_wait: false })
        .eq('id', e.target.value);
      if (error) console.error(error.message);
      getOrders();
    } catch (error) {
      console.error(error);
    }
  };
  const handleToWaitClick = e => {
    handleStatusBtnClick(e, true);
  };
  const handleDeleteBtnClick = async e => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', e.target.value);
      if (error) console.error(error.message);
      getOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div id='order-wait-completed-list'>
      {/* 예약 */}
      <div>
        <header>Reservations</header>
        <div className='wait-list-container'>
          <ul>
            {reservation.map((item, i) => (
              <div key={i} className='wait-list-container'>
                <li className='wait-list'>
                  <div className='wait-menu-list'>
                    {item.customer ? `${item.customer}: ` : ''}
                    {JSON.parse(item.order).map((item, i) => (
                      <span key={i}>{`${item.name}(${item.quantity})  `}</span>
                    ))}
                  </div>
                </li>
                <div className='button-box'>
                  <button
                    className='to-completed-btn btn'
                    name='reservation'
                    onClick={handleStatusBtnClick}
                    value={item.id}
                  >
                    완료
                  </button>
                  <button
                    className='to-completed-btn btn'
                    onClick={handleDeleteBtnClick}
                    value={item.id}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
      {/* 제조중 */}
      <div>
        <header>Preparing</header>
        <div className='wait-list-container'>
          <ul>
            {waitList.map((item, i) => (
              <div key={i} className='wait-list-container'>
                <li className='wait-list'>
                  <div className='wait-menu-list'>
                    {item.customer ? `${item.customer}: ` : ''}
                    {JSON.parse(item.order).map((item, i) => (
                      <span key={i}>{`${item.name}(${item.quantity})  `}</span>
                    ))}
                  </div>
                </li>
                <div className='button-box'>
                  <button
                    className='to-completed-btn btn'
                    onClick={handleStatusBtnClick}
                    value={item.id}
                    name='preparing'
                  >
                    완료
                  </button>
                  <button
                    className='to-completed-btn btn'
                    onClick={handleDeleteBtnClick}
                    value={item.id}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
      {/* 완료 */}
      <div>
        <header>Completed</header>
        <div className='completed-list-container'>
          <ul>
            {completedList.map((item, i) => (
              <div key={i}>
                <li className='completed-list'>
                  <div className='completed-menu-list'>
                    {item.customer ? `${item.customer}: ` : ''}
                    {JSON.parse(item.order).map((item, i) => (
                      <span key={i}>{`${item.name}(${item.quantity})  `}</span>
                    ))}
                  </div>
                </li>
                <button className='to-wait-btn btn' onClick={handleToWaitClick} value={item.id}>
                  취소
                </button>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WaitList;
