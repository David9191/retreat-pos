import React, { useState } from 'react';
import supabase from '../supabaseClient';
import { formatCurrency } from '../utils/formatNumber';
import { useOrderContext } from '../context/OrderContext';
import '../styles/OrderList.css';

const OrderList = () => {
  const [orderItems, setOrderItems] = useState([]);
  const [customer, setCustomer] = useState('');
  const [note, setNote] = useState('');
  const [receivedMoney, setReceivedMoney] = useState(0);
  const { triggerOrderUpdate } = useOrderContext();
  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalSales = orderItems.reduce((sum, item) => sum + item.total, 0);

  // 메뉴 데이터
  const menuItems = [
    { id: 1, name: '커피', price: 3000 },
    { id: 2, name: '아이스티', price: 3000 },
    { id: 3, name: '매실', price: 4000 },
    { id: 4, name: '과일컵', price: 4000 },
  ];

  const handleMenuClick = (menuItem, isRightClick = false) => {
    setOrderItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === menuItem.id);

      if (existingItem) {
        const newQuantity = isRightClick
          ? Math.max(0, existingItem.quantity - 1)
          : existingItem.quantity + 1;

        if (newQuantity === 0) {
          // 수량이 0이 되면 아이템 제거
          return prevItems.filter(item => item.id !== menuItem.id);
        } else {
          // 수량 업데이트
          return prevItems.map(item =>
            item.id === menuItem.id
              ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
              : item
          );
        }
      } else {
        // 새 아이템 추가 (우클릭이면 추가하지 않음)
        if (!isRightClick) {
          return [
            ...prevItems,
            {
              ...menuItem,
              quantity: 1,
              total: menuItem.price,
            },
          ];
        }
      }

      return prevItems;
    });
  };

  const handleRightClick = (e, menuItem) => {
    e.preventDefault();
    handleMenuClick(menuItem, true);
  };

  const handleOrderBtnClick = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          customer,
          note,
          order: JSON.stringify(orderItems),
          donation: Math.max(0, receivedMoney - totalSales),
        })
        .select();

      if (error) {
        console.error('Supabase error:', error);
        return;
      }

      // 주문 성공 시 상태 초기화
      setOrderItems([]);
      setCustomer('');
      setNote('');
      setReceivedMoney(0);

      // 전역 상태 업데이트하여 WaitList 리렌더링 트리거
      triggerOrderUpdate();

      alert('주문이 완료되었습니다!');
    } catch (error) {
      console.error(`Fetch error: ${error}`);
    }
  };

  return (
    <div id='pos'>
      <div className='menu-list'>
        {/* <h2>메뉴</h2> */}
        <div className='menu-button-group'>
          {menuItems.map(menuItem => (
            <button
              key={menuItem.id}
              className='menu-button btn'
              onClick={() => handleMenuClick(menuItem)}
              onContextMenu={e => handleRightClick(e, menuItem)}
            >
              <div className='menu-name'>{menuItem.name}</div>
            </button>
          ))}
        </div>

        <div className='info-group'>
          <div className='form'>
            <div className='input-container'>
              <input
                id='customer-name'
                type='text'
                value={customer}
                onChange={e => setCustomer(e.target.value)}
                autoComplete='off'
                placeholder='고객명'
              />
              <label htmlFor='customer-name'>고객명</label>
            </div>
            <div className='input-container'>
              <input
                id='note'
                type='text'
                value={note}
                onChange={e => setNote(e.target.value)}
                autoComplete='off'
                placeholder='비고'
              />
              <label htmlFor='note'>비고</label>
            </div>
            <div className='input-container'>
              <input
                id='received-money'
                type='number'
                value={receivedMoney}
                onChange={e => setReceivedMoney(e.target.value)}
                autoComplete='off'
                placeholder='받은 돈'
              />
              <label htmlFor='received-money'>받은 돈</label>
            </div>
          </div>
        </div>
        <div className='line'></div>
      </div>

      {/* 주문 리스트 영역 */}
      <div className='order-list-container'>
        {orderItems.length === 0 ? (
          <div className='empty-order'>주문할 메뉴를 선택해주세요</div>
        ) : (
          <div className='order-list'>
            {orderItems.map(item => (
              <div key={item.id} className='order-item'>
                <div className='item-info'>
                  <span className='item-name'>{item.name}</span>
                  <span className='item-quantity'>x{item.quantity}</span>
                </div>
                <div className='item-total'>{formatCurrency(item.quantity * item.price)}</div>
              </div>
            ))}
          </div>
        )}

        {/* 총계 */}
        {orderItems.length > 0 && (
          <div className='order-summary'>
            <div className='summary-item'>
              <span>총 수량:</span>
              <span>{totalQuantity}개</span>
            </div>
            <div className='summary-item'>
              <span>총 금액:</span>
              <span>{formatCurrency(totalSales)}</span>
            </div>
          </div>
        )}
      </div>

      {/* 주문 버튼 */}
      <div className='order-btn'>
        <button
          className='submit-order-btn btn'
          // onClick={handleSubmitOrder}
          disabled={orderItems.length === 0}
          onClick={handleOrderBtnClick}
        >
          주문하기
        </button>
      </div>
    </div>
  );
};

export default OrderList;
