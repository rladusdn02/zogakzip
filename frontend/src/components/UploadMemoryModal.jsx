import React, { useState } from 'react';
// import Modal from './Modal';
import PermissionRequestModal from './PermissionRequestModal';
import '../styles/UploadMemoryModal.css';

function UploadMemoryModal({ isOpen, onClose }) {
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [location, setLocation] = useState("");
  const [memoryDate, setMemoryDate] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [password, setPassword] = useState("");
  const [isPermissionModalOpen, setPermissionModalOpen] = useState(false); // 권한 요청 모달 상태 추가

  const handleSubmit = () => {
    // 추억 업로드 전 권한 요청 모달 띄우기
    setPermissionModalOpen(true);
  };

  const closePermissionModal = () => {
    setPermissionModalOpen(false);
    onClose(); // 권한 요청 후 메인 모달도 닫기
  };

  return (
    <>
      {/* <Modal isOpen={isOpen} onClose={onClose}> */}
        <div className="uploadmemory-page">
          <div className="uploadmemory-pagetitle">추억 올리기</div>
          <div className="uploadmemory-container">
            <div className="left-section">
              <div className="uploadmemory-nick">닉네임</div>
              <div className="uploadmemory-nick-container">
                <input className="uploadmemory-nickinput"
                  type="text" 
                  value={nickname} 
                  onChange={(e) => setNickname(e.target.value)} 
                  placeholder="닉네임을 입력해 주세요"
                />
              </div>
              
              <div className="uploadmemory-title">제목</div>
              <div className="uploadmemory-title-container">
                <input className="uploadmemory-titleinput"
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="제목을 입력해 주세요"
                />
              </div>
              
              <div className="uploadmemory-img">이미지</div>
              <div className="uploadmemory-img-container">
                <input className="uploadmemory-imginput"
                  type="file" 
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              
              <div className="uploadmemory-content">본문</div>
              <div className="uploadmemory-content-container">
                <textarea className="uploadmemory-contentinput"
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  placeholder="본문 내용을 입력해 주세요"
                ></textarea>
              </div>
            </div>
            <div className="right-section">
              <div className="uploadmemory-tag">태그</div>
              <div className="uploadmemory-tag-container">
                <input className="uploadmemory-taginput"
                  type="text" 
                  value={tags.join(', ')} 
                  onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                  placeholder="태그를 입력해 주세요 (쉼표로 구분)"
                />
              </div>
              <div className="uploadmemory-place">장소</div>
              <div className="uploadmemory-place-container">
                <input className="uploadmemory-placeinput"
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="장소를 입력해 주세요"
                />
              </div>
              
              <div className="uploadmemory-time">추억의 순간</div>
              <div className="uploadmemory-time-container">
                <input className="uploadmemory-timeinput"
                  type="date" 
                  value={memoryDate} 
                  onChange={(e) => setMemoryDate(e.target.value)} 
                />
              </div>
              
              <div className="uploadmemory-select">추억 공개 선택</div>
              <div className="uploadmemory-select-container">
                <input className="uploadmemory-selectinput"
                  type="checkbox" 
                  checked={isPublic} 
                  onChange={() => setIsPublic(!isPublic)} 
                /> 공개
              </div>
              
              <div className="uploadmemory-pwd">비밀번호 생성</div>
              <div className="uploadmemory-pwd-container">
                <input className="uploadmemory-pwdinput"
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="추억 비밀번호를 생성해 주세요"
                />
              </div>
            </div>
          </div>
          <div className="uploadmemory-button-contatiner">
            <button className="uploadmemory-button" onClick={handleSubmit}>올리기</button>
          </div>
        </div>
      {/* </Modal> */}

      <PermissionRequestModal 
        isOpen={isPermissionModalOpen} 
        onClose={closePermissionModal} 
      />
    </>
  );
}

export default UploadMemoryModal;