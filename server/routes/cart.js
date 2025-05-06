const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/add', async (req, res) => {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
        return res.status(400).json({ message: 'userId та itemId обовʼязкові.' });
    }

    try {

        const [existing] = await db.query(
            'SELECT * FROM cart_items WHERE user_id = ? AND item_id = ?',
            [userId, itemId]
        );

        if (existing.length > 0) {
            await db.query(
                'UPDATE cart_items SET quantity = quantity + 1 WHERE user_id = ? AND item_id = ?',
                [userId, itemId]
            );
        } else {
            await db.query(
                'INSERT INTO cart_items (user_id, item_id) VALUES (?, ?)',
                [userId, itemId]
            );
        }

        res.status(200).json({ message: 'Товар додано в кошик.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка при додаванні до кошика.' });
    }
});

router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const [items] = await db.query(`
            SELECT i.itemid, i.name, i.price, i.image_url, c.quantity
            FROM cart_items c
            JOIN items i ON c.item_id = i.itemid
            WHERE c.user_id = ?
        `, [userId]);

        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка при отриманні кошика.' });
    }
});

module.exports = router;