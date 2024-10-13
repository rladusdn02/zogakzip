const Memory = require('../models/Memory');
const bcrypt = require('bcryptjs');

// 게시글 등록
exports.createMemory = async (req, res) => {
    const { groupId } = req.params;
    const { nickname, title, content, postPassword, groupPassword, imageUrl, tags, location, moment, isPublic } = req.body;

    if (!nickname || !title || !content || !postPassword || !groupPassword) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        const hashedPostPassword = await bcrypt.hash(postPassword, 10);
        const hashedGroupPassword = await bcrypt.hash(groupPassword, 10);

        const [result] = await Memory.query(
            'INSERT INTO `Memories` (groupId, nickname, title, content, postPassword, groupPassword, imageUrl, tags, location, moment, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [groupId, nickname, title, content, hashedPostPassword, hashedGroupPassword, imageUrl, JSON.stringify(tags), location, moment, isPublic]
        );

        res.status(201).json({
            id: result.insertId,
            groupId,
            nickname,
            title,
            content,
            imageUrl,
            tags,
            location,
            moment,
            isPublic,
            likeCount: 0,
            commentCount: 0,
            createdAt: new Date(),
        });
    } catch (error) {
        console.error('Error creating memory:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 게시글 목록 조회
exports.getMemories = async (req, res) => {
    const { groupId } = req.params;
    const { page = 1, pageSize = 10, sortBy, keyword, isPublic } = req.query;

    const pageNumber = parseInt(page, 10);
    const size = parseInt(pageSize, 10);
    const offset = (pageNumber - 1) * size;

    const validSortOptions = {
        latest: 'createdAt',
        mostCommented: 'commentCount',
        mostLiked: 'likeCount',
    };
    const orderByColumn = validSortOptions[sortBy] || 'createdAt';

    try {
        const [memories] = await Memory.query(
            `SELECT * FROM \`Memories\` WHERE groupId = ? AND isPublic = ? AND (title LIKE ? OR content LIKE ?) ORDER BY ${orderByColumn} LIMIT ${size} OFFSET ${offset}`,
            [groupId, isPublic === 'true', `%${keyword}%`, `%${keyword}%`]
        );

        const [totalCountResult] = await Memory.query(
            'SELECT COUNT(*) AS count FROM `Memories` WHERE groupId = ? AND isPublic = ? AND (title LIKE ? OR content LIKE ?)',
            [groupId, isPublic === 'true', `%${keyword}%`, `%${keyword}%`]
        );
        const totalCount = totalCountResult[0].count;

        const formattedMemories = memories.map(memory => ({
            id: memory.id,
            nickname: memory.nickname,
            title: memory.title,
            imageUrl: memory.imageUrl,
            tags: JSON.parse(memory.tags),
            location: memory.location,
            moment: memory.moment,
            isPublic: !!memory.isPublic,
            likeCount: memory.likeCount,
            commentCount: memory.commentCount,
            createdAt: memory.createdAt,
        }));

        res.status(200).json({
            currentPage: pageNumber,
            totalPages: Math.ceil(totalCount / size),
            totalItemCount: totalCount,
            data: formattedMemories,
        });
    } catch (error) {
        console.error('Error fetching memories:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 게시글 수정
exports.updateMemory = async (req, res) => {
    const { postId } = req.params;
    const { nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic } = req.body;

    try {
        const [memoryResult] = await Memory.query('SELECT * FROM `Memories` WHERE id = ?', [postId]);
        if (memoryResult.length === 0) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        const memory = memoryResult[0];
        const passwordMatch = await bcrypt.compare(postPassword, memory.postPassword);
        if (!passwordMatch) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        await Memory.query(
            'UPDATE `Memories` SET nickname = ?, title = ?, content = ?, imageUrl = ?, tags = ?, location = ?, moment = ?, isPublic = ? WHERE id = ?',
            [nickname, title, content, imageUrl, JSON.stringify(tags), location, moment, isPublic, postId]
        );

        res.status(200).json({ message: '게시글 수정 성공' });
    } catch (error) {
        console.error('Error updating memory:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 게시글 삭제
exports.deleteMemory = async (req, res) => {
    const { postId } = req.params;
    const { postPassword } = req.body;

    try {
        const [memoryResult] = await Memory.query('SELECT * FROM `Memories` WHERE id = ?', [postId]);
        if (memoryResult.length === 0) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        const memory = memoryResult[0];
        const passwordMatch = await bcrypt.compare(postPassword, memory.postPassword);
        if (!passwordMatch) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }

        await Memory.query('DELETE FROM `Memories` WHERE id = ?', [postId]);
        res.status(200).json({ message: '게시글 삭제 성공' });
    } catch (error) {
        console.error('Error deleting memory:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};

// 게시글 상세 정보 조회
exports.getMemoryDetails = async (req, res) => {
    const { postId } = req.params;

    try {
        const [memoryResult] = await Memory.query('SELECT * FROM `Memories` WHERE id = ?', [postId]);
        if (memoryResult.length === 0) {
            return res.status(404).json({ message: '존재하지 않습니다' });
        }

        const memory = memoryResult[0];

        const response = {
            id: memory.id,
            groupId: memory.groupId,
            nickname: memory.nickname,
            title: memory.title,
            content: memory.content,
            imageUrl: memory.imageUrl,
            tags: JSON.parse(memory.tags),
            location: memory.location,
            moment: memory.moment,
            isPublic: !!memory.isPublic,
            likeCount: memory.likeCount,
            commentCount: memory.commentCount,
            createdAt: memory.createdAt,
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching memory details:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
