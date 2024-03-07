const mysql = require('mysql');
const http = require('http');

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'sql8.freemysqlhosting.net',
  user: 'sql8689226',
  password: 'SlU4NVg6gD',
  database: 'sql8689226'
});

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Indicate that the content type of the response is JSON
  res.setHeader('Content-Type', 'application/json');

  // Check if the request method is POST
  if (req.method === 'POST') {
    let body = '';

    // Read the data from the request body
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        // Parse the JSON data
        const postData = JSON.parse(body);
        const carouselItemId = postData['CarouselItemID'];

        // Check if CarouselItemID is present
        if (!carouselItemId) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'CarouselItemID is required' }));
          return;
        }

        // SQL to delete the post based on user confirmation
        const deleteSql = "DELETE FROM CarouselItems WHERE CarouselItemID = ?";

        // Execute the delete query
        pool.query(deleteSql, [carouselItemId], (error, results) => {
          if (error) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error.message }));
            return;
          }

          // Check for successful deletion
          if (results.affectedRows > 0) {
            res.end(JSON.stringify({ message: 'Post removed successfully.' }));
          } else {
            res.statusCode = 404; // Not Found
            res.end(JSON.stringify({ error: 'Post not found or already removed.' }));
          }
        });
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON data' }));
      }
    });
  } else {
    // Handle other request methods
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
