const Group = require('../models/Group');
const bcrypt = require('bcryptjs');

exports.createGroup = async (req, res) => {
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    // 필수 필드 확인
    if (!name || !password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        // 비밀번호 해시
        const hashedPassword = await bcrypt.hash(password, 10);

        // 그룹 생성 SQL 쿼리
        const [result] = await Group.query(
            'INSERT INTO `Groups` (name, password, password_hash, imageUrl, isPublic, introduction) VALUES (?, ?, ?, ?, ?, ?)',
            [name, password, hashedPassword, imageUrl, isPublic, introduction]
        );

        // 응답 반환
        res.status(201).json({
            id: result.insertId,
            name,
            imageUrl,
            isPublic: Boolean(isPublic), // boolean으로 변환
            likeCount: 0,
            badges: [],
            postCount: 0,
            createdAt: new Date(),
            introduction,
        });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

exports.getGroups = async (req, res) => {
    const { page = 1, pageSize = 10, sortBy, isPublic } = req.query;

    const pageNumber = parseInt(page, 10);
    const size = parseInt(pageSize, 10);
    const offset = (pageNumber - 1) * size;

    // 유효한 sortBy 값 확인 및 정렬 컬럼 결정
    const validSortOptions = {
        latest: 'createdAt',
        mostPosted: 'postCount',
        mostLiked: 'likeCount',
        mostBadge: 'badgeCount'
    };
    const orderByColumn = validSortOptions[sortBy] || 'createdAt'; // 기본값 설정

    // isPublic 변환
    const isPublicValue = (isPublic === 'true');  // boolean으로 변환

    // SQL 쿼리 작성 (LIMIT과 OFFSET을 직접 값으로 삽입)
    const query = `SELECT * FROM \`Groups\` WHERE isPublic = ? ORDER BY ${orderByColumn} LIMIT ${size} OFFSET ${offset}`;

    try {
        const [groups] = await Group.query(query, [isPublicValue]);

        // 전체 그룹 개수를 가져오기 위한 별도의 쿼리
        const [totalCountResult] = await Group.query('SELECT COUNT(*) AS count FROM `Groups` WHERE isPublic = ?', [isPublicValue]);
        const totalCount = totalCountResult[0].count;

        // 필요한 데이터만 추출 (password와 password_hash는 제외)
        const formattedGroups = groups.map(group => ({
            id: group.id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: Boolean(group.isPublic), // boolean으로 변환
            likeCount: group.likeCount,
            badgeCount: group.badgeCount,
            postCount: group.postCount,
            createdAt: group.createdAt,
            introduction: group.introduction
        }));

        res.status(200).json({
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCount / size),
            totalItemCount: totalCount,
            data: formattedGroups,
        });
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

exports.updateGroup = async (req, res) => {
    const { groupId } = req.params;
    const { name, password, imageUrl, isPublic, introduction } = req.body;

    // 필수 필드 확인
    if (!name || !password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        const [groupResult] = await Group.query('SELECT * FROM `Groups` WHERE id = ?', [groupId]);
        if (groupResult.length === 0) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        const group = groupResult[0];
        const passwordMatch = await bcrypt.compare(password, group.password_hash);
        if (!passwordMatch) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        // 그룹 업데이트 SQL 쿼리
        await Group.query('UPDATE `Groups` SET name = ?, imageUrl = ?, isPublic = ?, introduction = ? WHERE id = ?', 
        [name, imageUrl, isPublic, introduction, groupId]);

        res.status(200).json({ message: '그룹 수정 성공' });
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

exports.deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    // 비밀번호 체크
    if (!password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        const [groupResult] = await Group.query('SELECT * FROM `Groups` WHERE id = ?', [groupId]);
        if (groupResult.length === 0) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        const group = groupResult[0];
        const passwordMatch = await bcrypt.compare(password, group.password_hash);
        if (!passwordMatch) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        await Group.query('DELETE FROM `Groups` WHERE id = ?', [groupId]);
        res.status(200).json({ message: '그룹 삭제 성공' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 그룹 상세 정보
exports.getGroupDetails = async (req, res) => {
    const { groupId } = req.params;

    try {
        const [groupResult] = await Group.query('SELECT * FROM `Groups` WHERE id = ?', [groupId]);
        if (groupResult.length === 0) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        const group = groupResult[0];

        // 응답 객체 구성
        const response = {
            id: group.id,
            name: group.name,
            imageUrl: group.imageUrl,
            isPublic: Boolean(group.isPublic), // boolean으로 변환
            likeCount: group.likeCount,
            badges: [], // 현재는 빈 배열로 설정 (필요에 따라 데이터 추가)
            postCount: group.postCount,
            createdAt: group.createdAt,
            introduction: group.introduction,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching group details:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

exports.verifyGroupPassword = async (req, res) => {
    const { groupId } = req.params;
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        const [groupResult] = await Group.query('SELECT * FROM `Groups` WHERE id = ?', [groupId]);
        if (groupResult.length === 0) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        const group = groupResult[0];
        const passwordMatch = await bcrypt.compare(password, group.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
        }

        res.status(200).json({ message: '비밀번호가 확인되었습니다' });
    } catch (error) {
        console.error('Error verifying password:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

exports.likeGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
        const [groupResult] = await Group.query('SELECT * FROM `Groups` WHERE id = ?', [groupId]);
        if (groupResult.length === 0) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        await Group.query('UPDATE `Groups` SET likeCount = likeCount + 1 WHERE id = ?', [groupId]);
        res.status(200).json({ message: '그룹 공감하기 성공' });
    } catch (error) {
        console.error('Error liking group:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

exports.getGroupPublicStatus = async (req, res) => {
    const { groupId } = req.params;

    try {
        const [groupResult] = await Group.query('SELECT id, isPublic FROM `Groups` WHERE id = ?', [groupId]);
        if (groupResult.length === 0) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        const group = groupResult[0];
        res.status(200).json({ id: group.id, isPublic: Boolean(group.isPublic) }); // boolean으로 변환
    } catch (error) {
        console.error('Error fetching group public status:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
