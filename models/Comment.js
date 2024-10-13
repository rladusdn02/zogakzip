const db = require('../config/db');

const Comment = {
    create: async (postId, nickname, content, password) => {
        const sql = `INSERT INTO comments (post_id, nickname, content, password, created_at) 
                     VALUES (?, ?, ?, ?, NOW())`;
        const [result] = await db.query(sql, [postId, nickname, content, password]);
        return result.insertId;
    },

    findAllByPostId: async (postId, page, pageSize) => {
        const offset = (page - 1) * pageSize;
        const sql = `SELECT id, nickname, content, created_at 
                     FROM comments 
                     WHERE post_id = ? 
                     ORDER BY created_at DESC 
                     LIMIT ?, ?`;
        const [comments] = await db.query(sql, [postId, offset, pageSize]);
        return comments;
    },

    update: async (commentId, nickname, content, password) => {
        const sql = `UPDATE comments SET nickname = ?, content = ? 
                     WHERE id = ? AND password = ?`;
        const [result] = await db.query(sql, [nickname, content, commentId, password]);
        return result.affectedRows > 0;
    },

    delete: async (commentId, password) => {
        const sql = `DELETE FROM comments WHERE id = ? AND password = ?`;
        const [result] = await db.query(sql, [commentId, password]);
        return result.affectedRows > 0;
    },

    findById: async (commentId) => {
        const sql = `SELECT * FROM comments WHERE id = ?`;
        const [comment] = await db.query(sql, [commentId]);
        return comment[0];
    },
};

module.exports = Comment;
