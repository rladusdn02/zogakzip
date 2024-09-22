import React from 'react';
 import { BrowserRouter, Routes, Route } from "react-router-dom";
//  import "./App.css";
 import GroupPage from './components/GroupPage';
 import UploadMemoryModal from './components/UploadMemoryModal';
 import PrivateMemoryPage from './components/PrivateMemoryPage';
 import MemoryDetailPage from './components/MemoryDetailPage';


 function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<GroupPage />} />
                <Route path="/uploadmemory" element={<UploadMemoryModal />} />
                <Route path="/privatememory" element={<PrivateMemoryPage />} />
                <Route path="/memorydetail" element={<MemoryDetailPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;