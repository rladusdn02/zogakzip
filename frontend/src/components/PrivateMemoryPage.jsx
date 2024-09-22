import React from 'react';
import "../styles/PrivateMemoryPage.css"
import logo from "../assets/logo.svg";

function PrivateMemoryPage() {

  return (
    <div className="page-container">
      <div className="logo-content">
        <img src={logo} alt='logo'/>
      </div>
      <div className="privatepermission-title">
        비공개 추억
      </div>
      <div className="privatepermission-description">
        비공개 추억에 접근하기 위해 권한 확인이 필요합니다.
      </div>
      <div className="privatepermission-pwd">
          비밀번호 입력
      </div>
      <div className="privatepermission-password">
        <input className="privatepermission-pwdinput"
          type="password"
          placeholder="추억 비밀번호를 입력해 주세요"
        />
      </div>
      
      <div className="privatepermission-button-container">
        <button className="privatepermission-button">제출하기</button>
      </div>
    </div>
  )
}

export default PrivateMemoryPage;