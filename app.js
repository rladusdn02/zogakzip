const express = require('express');
const cors = require('cors');
const groupRoutes = require('./routes/groupRoutes'); // 그룹 관련 API 라우터
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const imageRoutes = require('./routes/imageRoutes');

// CORS 설정
app.use(cors({
    origin: 'https://project-zogakzip-fe.vercel.app', // 프론트엔드 도메인
}));

// JSON 요청 본문 파싱을 위한 미들웨어
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', imageRoutes);

// 그룹 관련 API 라우트 설정
app.use('/api/groups', groupRoutes);

// 기본 루트 확인
app.get('/', (req, res) => {
    res.send('API 서버가 정상적으로 작동 중입니다.');
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
