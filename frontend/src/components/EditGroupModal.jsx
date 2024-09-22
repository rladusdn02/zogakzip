import React, { useState } from 'react';
import Modal from './Modal';
import "../styles/EditGroupModal.css";

function EditGroupModal({ isOpen, onClose }) {
  const [groupName, setGroupName] = useState("달봉이네 가족");
  const [isPublic, setIsPublic] = useState(false);
  const [password, setPassword] = useState("");

  const handleGroupNameChange = (e) => setGroupName(e.target.value);
  const handlePublicChange = () => setIsPublic(!isPublic);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = () => {
    // 수정 작업 처리 로직을 여기에 추가
    console.log({
      groupName,
      isPublic,
      password,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="edit-modal">
        <div className="edit-title">그룹 정보 수정</div>
        <div className="edit-input">그룹명</div>
        <div className="edit-input-container">
          <input className="edit-inputtext"
            type="text" 
            value={groupName} 
            onChange={handleGroupNameChange}
          />
        </div>
        
        <div className="edit-img">대표 이미지</div>
        <div className="edit-img-container">
          <input className="edit-inputimg" type="file" />
        </div>

        <div className="edit-group">그룹 소개</div>
        <div className="edit-group-container">
          <textarea className="edit-inputgroup" placeholder="그룹을 소개해 주세요"></textarea>
        </div>

        <div className="edit-private">그룹 공개 선택</div>
        <div className="edit-select-container">
          <input className="edit-select"
            type="checkbox" 
            checked={isPublic} 
            onChange={handlePublicChange} 
          /> 공개
        </div>
        
        <div className="edit-pwd">수정 권한 인증</div>
        <div className="edit-pwd-container">
          <input className="edit-inputpwd"
            type="password" 
            placeholder="그룹 비밀번호를 입력해 주세요" 
            value={password} 
            onChange={handlePasswordChange} 
          />
        </div>
        
        <div className="edit-button-container">
          <button className="edit-button" onClick={handleSubmit}>수정하기</button>
        </div>
      </div>
      
    </Modal>
  );
}

export default EditGroupModal;