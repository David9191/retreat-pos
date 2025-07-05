import React from 'react'
import '../styles/Header.css'

const Header = () => {
    return (
        <header>
            <h1>LIB 청년부 수련회 사업 주문 내역</h1>
            <div>
                <div id='total-quantity'>총 수량: {}개</div>
                <div id='total-sales'>총 매출: {}원</div>
            </div>
        </header>
    )
}

export default Header