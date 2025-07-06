import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Analytics from './pages/Analytics';
import { OrderProvider } from './context/OrderContext';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <OrderProvider>
      <BrowserRouter>
        <div className='App'>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/retreat-app/' element={<Home />} />
            <Route path='/retreat-app/retreat-pos/' element={<Home />} />
            <Route path='/retreat-app/analytics' element={<Analytics />} />
          </Routes>
        </div>
      </BrowserRouter>
    </OrderProvider>
  );
}

App.displayName = 'App'; // 이 줄 추가

export default App;
