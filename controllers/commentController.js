const Comment = require('../models/Comment');

// 댓글 등록
exports.createComment = async (req, res) => {
    const { nickname, content, password } = req.body;
    const { postId } = req.params;

    if (!nickname || !content || !password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        const commentId = await Comment.create(postId, nickname, content, password);
        const comment = await Comment.findById(commentId);
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

// 댓글 목록 조회
exports.getComments = async (req, res) => {
    const { postId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;

    try {
        const comments = await Comment.findAllByPostId(postId, parseInt(page), parseInt(pageSize));
        res.status(200).json({
            currentPage: parseInt(page),
            data: comments,
        });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

// 댓글 수정
exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { nickname, content, password } = req.body;

    if (!nickname || !content || !password) {
        return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    try {
        const success = await Comment.update(commentId, nickname, content, password);
        if (!success) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }
        const updatedComment = await Comment.findById(commentId);
        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다' });
    }
};

// 댓글 삭제
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const { password } = req.body;

    try {
        const success = await Comment.delete(commentId, password);
        if (!success) {
            return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
        }
        res.status(200).json({ message: '답글 삭제 성공' });
    } catch (error) {
        res.status(500).json({ message: '서버 오류입니다' });
    }
};
