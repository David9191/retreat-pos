import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import { OrderProvider } from './context/OrderContext';
import './App.css';

function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <div className='App'>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </OrderProvider>
  );
}

export default App;
