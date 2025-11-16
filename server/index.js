import express, { json } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose, { get } from 'mongoose';
import cors from 'cors';
import { postRegister, getUsers, getBlogs, postBlogs, getlogin, getBlog, userBlogs, deleteBlog, getPublished, patchBlog, postComment, getComments, getBlogBySlug } from './controllers/controller.js';
import { Comment } from './models/Comment.js';
import path from 'path';
import fs from 'fs';
dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());
app.use(json());
app.use(cors());
const conn = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('DB Connect Successfully');
  } catch (e) {
    console.error('DB connection failed', e);
  }
};

app.get('/', (req, res) => {
  res.send('Tiny Blog Server Has Started');
});

const jwtCheck = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      sucess: false,
      message: 'Authorization header missing or invalid format'
    });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(403).json({
      sucess: false,
      message: 'Invalid or expired token'
    });
  }
};

app.post('/register', postRegister);
app.post('/login', getlogin);
app.get('/users', getUsers);

app.get('/blogs/slug/:slug', getBlogBySlug);
app.get('/blogs/user/:id', jwtCheck, userBlogs);
app.get('/published', getPublished);

app.get('/blogs/:id', getBlog);
app.get('/blogs', getBlogs);

app.get('/blogs/:blogId/comments', getComments);
app.post('/blogs/:blogId/comments', jwtCheck, postComment);

app.post('/blogs', jwtCheck, postBlogs);
app.patch('/edit/:id', jwtCheck, patchBlog);
app.delete('/blogs/:id', jwtCheck, deleteBlog);

const clientDist = path.join(process.cwd(), '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res) => {
    if (req.method !== 'GET' || (req.headers.accept && req.headers.accept.includes('application/json'))) {
      return res.status(404).json({ sucess: false, message: 'Not Found' });
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  conn();
  console.log(`Server is running on port http://localhost:${PORT}`);
});