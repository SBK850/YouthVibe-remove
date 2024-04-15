const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MySQL connection pool settings
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'mudfoot.doc.stu.mmu.ac.uk',
    user: 'bahkaras',
    password: 'hirsponD3',
    database: 'bahkaras',
    port: 6306
});

// Route to handle post removal
app.post('/remove-post', (req, res) => {
    const carouselItemId = req.body.CarouselItemID;

    if (!carouselItemId) {
        res.status(400).json({ message: 'Invalid request: CarouselItemID is missing' });
        return;
    }

    const query = 'DELETE FROM CarouselItems WHERE CarouselItemID = ?';

    pool.query(query, [carouselItemId], (error, results) => {
        if (error) {
            console.error('Error executing the query:', error);
            res.status(500).json({ message: 'Failed to remove post' });
            return;
        }

        if (results.affectedRows > 0) {
            res.json({ message: 'Post removed successfully.' });
        } else {
            res.status(404).json({ message: 'No post found with the given ID or deletion was not necessary.' });
        }
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
