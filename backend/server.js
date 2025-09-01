
// backend/server.js
const http = require('http');
const url = require('url');
const connection = require('./db');

const PORT = 5000;

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  // ------------------ CORS ------------------
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ------------------ ROOT ------------------
  if (reqUrl.pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'E-Learning Backend Running' }));
  }

  // ------------------ COURSES CRUD ------------------
  else if (reqUrl.pathname === '/api/courses' && req.method === 'GET') {
    connection.query('SELECT * FROM courses', (err, results) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (err) res.end(JSON.stringify({ error: err.message }));
      else res.end(JSON.stringify(results));
    });
  }

  else if (reqUrl.pathname.match(/^\/api\/courses\/\d+$/) && req.method === 'GET') {
    const courseId = reqUrl.pathname.split('/')[3];
    connection.query('SELECT * FROM courses WHERE id = ?', [courseId], (err, results) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (err) res.end(JSON.stringify({ error: err.message }));
      else res.end(JSON.stringify(results[0] || {}));
    });
  }

  else if (reqUrl.pathname === '/api/courses' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { title, description, category, price } = JSON.parse(body);
      const query = 'INSERT INTO courses (title, description, category, price) VALUES (?, ?, ?, ?)';
      connection.query(query, [title, description, category, price], (err, results) => {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        if (err) res.end(JSON.stringify({ error: err.message }));
        else res.end(JSON.stringify({ message: 'Course added', courseId: results.insertId }));
      });
    });
  }

  else if (reqUrl.pathname.match(/^\/api\/courses\/\d+$/) && req.method === 'PUT') {
    const courseId = reqUrl.pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { title, description, category, price } = JSON.parse(body);
      const query = 'UPDATE courses SET title=?, description=?, category=?, price=? WHERE id=?';
      connection.query(query, [title, description, category, price, courseId], (err) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (err) res.end(JSON.stringify({ error: err.message }));
        else res.end(JSON.stringify({ message: 'Course updated' }));
      });
    });
  }

  else if (reqUrl.pathname.match(/^\/api\/courses\/\d+$/) && req.method === 'DELETE') {
    const courseId = reqUrl.pathname.split('/')[3];
    connection.query('DELETE FROM courses WHERE id=?', [courseId], (err) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
      if (err) res.end(JSON.stringify({ error: err.message }));
      else res.end(JSON.stringify({ message: 'Course deleted' }));
    });
  }

  // ------------------ LECTURES ------------------
  else if (reqUrl.pathname.match(/^\/api\/courses\/\d+\/lectures$/) && req.method === 'GET') {
    const courseId = reqUrl.pathname.split('/')[3];
    connection.query('SELECT * FROM lectures WHERE course_id=?', [courseId], (err, results) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
      if (err) res.end(JSON.stringify({ error: err.message }));
      else res.end(JSON.stringify(results));
    });
  }

  else if (reqUrl.pathname.match(/^\/api\/courses\/\d+\/lectures$/) && req.method === 'POST') {
    const courseId = reqUrl.pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
    const { title, duration } = JSON.parse(body);
      connection.query('INSERT INTO lectures (course_id, title, duration) VALUES (?, ?, ?)', 
        [courseId, title, duration], (err, results) => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          if (err) res.end(JSON.stringify({ error: err.message }));
          else res.end(JSON.stringify({ message: 'Lecture added', lectureId: results.insertId }));
        });
    });
  }

  // ------------------ QUIZZES ------------------
  else if (reqUrl.pathname.match(/^\/api\/courses\/\d+\/quizzes$/) && req.method === 'GET') {
    const courseId = reqUrl.pathname.split('/')[3];
    connection.query('SELECT * FROM quizzes WHERE course_id=?', [courseId], (err, results) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
      if (err) res.end(JSON.stringify({ error: err.message }));
      else res.end(JSON.stringify(results));
    });
  }

  else if (reqUrl.pathname.match(/^\/api\/courses\/\d+\/quizzes$/) && req.method === 'POST') {
    const courseId = reqUrl.pathname.split('/')[3];
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
    const { question, options, answer } = JSON.parse(body);
      const query = 'INSERT INTO quizzes (course_id, question, options, answer) VALUES (?, ?, ?, ?)';
      connection.query(query, [courseId, question, JSON.stringify(options), answer], (err, results) => {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        if (err) res.end(JSON.stringify({ error: err.message }));
        else res.end(JSON.stringify({ message: 'Quiz added', quizId: results.insertId }));
      });
    });
  }

  // ------------------ STUDENT ENROLLMENTS ------------------
  else if (reqUrl.pathname === '/api/enroll' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { userId, courseId } = JSON.parse(body);
      const query = 'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)';
      connection.query(query, [userId, courseId], (err, results) => {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        if (err) res.end(JSON.stringify({ error: err.message }));
        else res.end(JSON.stringify({ message: 'Student enrolled', enrollmentId: results.insertId }));
      });
    });
  }

  else if (reqUrl.pathname.match(/^\/api\/users\/\d+\/courses$/) && req.method === 'GET') {
    const userId = reqUrl.pathname.split('/')[3];
    connection.query(
      'SELECT c.* FROM courses c JOIN enrollments e ON c.id = e.course_id WHERE e.user_id=?',
    [userId],
      (err, results) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (err) res.end(JSON.stringify({ error: err.message }));
        else res.end(JSON.stringify(results));
      }
    );
  }

  // ------------------ CERTIFICATES ------------------
  else if (reqUrl.pathname.match(/^\/api\/users\/\d+\/certificates$/) && req.method === 'GET') {
    const userId = reqUrl.pathname.split('/')[3];
    connection.query('SELECT * FROM certificates WHERE user_id=?', [userId], (err, results) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
      if (err) res.end(JSON.stringify({ error: err.message }));
      else res.end(JSON.stringify(results));
    });
  }

  else if (reqUrl.pathname === '/api/certificates' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const { userId, courseId, certificateUrl } = JSON.parse(body);
      const query = 'INSERT INTO certificates (user_id, course_id, certificate_url) VALUES (?, ?, ?)';
      connection.query(query, [userId, courseId, certificateUrl], (err, results) => {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        if (err) res.end(JSON.stringify({ error: err.message }));
        else res.end(JSON.stringify({ message: 'Certificate added', certificateId: results.insertId }));
      });
    });
  }

  // ------------------ SIGNUP ------------------
  else if (reqUrl.pathname === '/api/signup' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const { name, email, password, role } = JSON.parse(body);
        const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        connection.query(query, [name, email, password, role || 'student'], (err, results) => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          if (err) res.end(JSON.stringify({ error: err.message }));
          else res.end(JSON.stringify({ message: 'User registered', userId: results.insertId }));
        });
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  }

  // ------------------ LOGIN ------------------
  else if (reqUrl.pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        const query = 'SELECT * FROM users WHERE email=? AND password=?';
        connection.query(query, [email, password], (err, results) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          } else if (results.length === 0) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid email or password' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `Login successful: ${results[0].name}`, user: results[0] }));
          }
        });
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  }

  // ------------------ USER PROFILE DETAILS ------------------
  else if (reqUrl.pathname === '/api/user-details' && req.method === 'GET') {
    const email = reqUrl.query.email;
    if (!email) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Email required' }));
      return;
    }
    connection.query('SELECT * FROM users WHERE email=?', [email], (err, userResults) => {
      if (err || !userResults.length) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }
      const user = userResults[0];
      if (user.role === 'student') {
        connection.query(
          'SELECT c.* FROM courses c JOIN enrollments e ON c.id = e.course_id WHERE e.user_id=?',
          [user.id],
          (err, courses) => {
            if (err) courses = [];
            connection.query(
              'SELECT q.* FROM quizzes q JOIN quiz_attempts qa ON q.id = qa.quiz_id WHERE qa.user_id=?',
              [user.id],
              (err, quizzes) => {
                if (err) quizzes = [];
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  enrolledCourses: courses || [],
                  enrolledQuizzes: quizzes || []
                }));
              }
            );
          }
        );
      } else if (user.role === 'instructor') {
        connection.query(
          'SELECT * FROM courses WHERE instructor_id=?',
          [user.id],
          (err, courses) => {
            if (err) courses = [];
            connection.query(
              'SELECT u.name, u.email FROM users u JOIN enrollments e ON u.id = e.user_id JOIN courses c ON e.course_id = c.id WHERE c.instructor_id=?',
              [user.id],
              (err, students) => {
                if (err) students = [];
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                  courses: courses || [],
                  enrolledStudents: students || []
                }));
              }
            );
          }
        );
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({}));
      }
    });
  }

  // ------------------ CONTACT ------------------
  else if (reqUrl.pathname === '/api/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      let { name, email, subject, message } = JSON.parse(body);
      if (!subject) subject = 'Contact Form';
      const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';
      connection.query(query, [name, email, subject, message], (err, results) => {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        if (err) res.end(JSON.stringify({ error: err.message }));
        else res.end(JSON.stringify({ message: 'Message sent', contactId: results.insertId }));
      });
    });
  }

  // ------------------ 404 ------------------
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

// ------------------ START SERVER ------------------
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
