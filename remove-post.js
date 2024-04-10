const mysql = require('mysql');
const http = require('http');

// Create a connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'mudfoot.doc.stu.mmu.ac.uk',
  user: 'bahkaras',
  password: 'hirsponD3',
  database: 'bahkaras'
});

// Create an HTTP server
const server = http.createServer((req, res) => {
  // CORS Headers to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allows access from any origin
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT'); // Specifies the methods allowed when accessing the resource
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allows headers
  res.setHeader('Content-Type', 'application/json'); // Indicate that the content type of the response is JSON

  // Preflight request handling
  if (req.method === 'OPTIONS') {
    res.statusCode = 204; // No Content
    res.end();
    return;
  }

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
    // Handle other request methods with 405 Method Not Allowed
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
