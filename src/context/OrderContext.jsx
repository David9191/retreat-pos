import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderUpdateTrigger, setOrderUpdateTrigger] = useState(0);

  const triggerOrderUpdate = () => {
    setOrderUpdateTrigger(prev => prev + 1);
  };

  return (
    <OrderContext.Provider value={{ orderUpdateTrigger, triggerOrderUpdate }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider');
  }
  return context;
};
