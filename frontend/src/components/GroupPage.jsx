import React, {useState} from 'react';
import "../styles/GroupPage.css";
import logo from "../assets/logo.svg";
import groupimg from "../assets/groupimg.png";
import flowericon from "../assets/icon=flower.svg";
import publicimg from "../assets/state=public.png";
import privateimg from "../assets/state=private0.png";
import nomemory from "../assets/icon=empty.svg";
import EditGroupModal from './EditGroupModal';
import DeleteGroupModal from './DeleteGroupModal';
import { Link } from 'react-router-dom';

function GroupPage() {
    console.log("GroupPage:", GroupPage);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleEditClick = () => setEditModalOpen(true);
  const handleDeleteClick = () => setDeleteModalOpen(true);

  const closeEditModal = () => setEditModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  return (
    <div className="page-container">
      <div className="logo-content">
        <img src={logo} alt="조각집로고" ></img>
      </div>

      <div className="group-content">
        <div className="group-img">
          <img src={groupimg} alt="groupimg"></img>
        </div>

        <div className="group-info">

          <div className="group-button">
            <button className="button-fix" onClick={handleEditClick}>그룹 정보 수정하기</button>
            <button className="button-delete" onClick={handleDeleteClick}>그룹 삭제하기</button>
          </div>

          <div className="group-header">
            <div className="group-dday">D+265</div>
            <div className="group-status">공개</div>
          </div>
          
          <div className="group-title-header">
            <div className="group-title">달봉이네 가족</div>
            <div className="group-stats">추억 8 | 그룹 공간 1.5K</div>
          </div>

          <div className="group-description">
            서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.
          </div>

          <div className="group-badge">획득 배지</div>
            <div className="badges">
              <div className="badge">👾   7일 연속 추억 등록</div>
              <div className="badge">🌼   그룹 공감 1만 개 이상 받기</div>
              <div className="badge">💖   추억 공감 1만 개 이상 받기</div>
            </div>

            <div className="group-actions">
              <button className="button-empathy">
                <img src={flowericon} className="flowericon" alt="flowericon"></img>
                공감 보내기
              </button>
            </div>
          </div>

        </div>

      <div className="memory-list">
        <div className="memory-header">
          <div className="memory-title">추억 목록</div>
          <Link to="/uploadmemory">
          <div className="last-button">
            <button className="memory-button" 
            >추억 올리기</button>
          </div>
          </Link>
        </div>
        <div className="memory-search">
          
          <div className="privacy-select">
            <div className="public" selected>
              <img src={publicimg} alt="publicimg"></img>
            </div>
            <div value="private" className="private">
              <img src={privateimg} alt="privateimg"></img>
            </div>
          </div>
        
          <div className="input-container">
            <input type="text" className="inputtext" placeholder="태그 혹은 제목을 입력해 주세요" />
          </div>

          <select className="memory-order">
            <option value="empathy">
              공감순 
            </option>
            <option value="recommend">
              추천순 
            </option>
          </select>

        </div>

        <div className="no-memory">
          <img src={nomemory} alt="nomemory"></img>
        </div>

        <Link to="/uploadmemory">
          <div className="last-button">
            <button className="memory-button" 
            >추억 올리기</button>
          </div>
        </Link>
        
      </div>

      <EditGroupModal isOpen={isEditModalOpen} onClose={closeEditModal} />
      <DeleteGroupModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} />
    </div>
  );
}

export default GroupPage;