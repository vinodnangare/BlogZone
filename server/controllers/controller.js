import {User} from './../models/User.js';
import {Blog} from './../models/Blog.js';
import {Comment} from './../models/Comment.js';
import md5 from 'md5';
import jwt from 'jsonwebtoken';
import slugify from 'slugify';

const postRegister = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.json({
      sucess: false,
      message: 'All fields are required'
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        sucess: false,
        message: 'Email already registered'
      });
    }

    const hashedPassword = md5(password);
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    return res.json({
      sucess: true,
      message: 'User registered successfully'
    });
  } catch (e) {
    console.error('Registration error:', e);
    return res.json({
      sucess: false,
      message: 'Registration failed'
    });
  }
};

const getlogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      sucess: false,
      message: 'Email and password are required'
    });
  }

  try {
    const hashedPassword = md5(password);
    const user = await User.findOne({ 
      email, 
      password: hashedPassword 
    }).select('-password -__v -createdAt -updatedAt');

    if (!user) {
      return res.json({
        sucess: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      sucess: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email
        },
        token
      }
    });
  } catch (e) {
    console.error('Login error:', e);
    return res.json({
      sucess: false,
      message: 'Login failed'
    });
  }
}


const getUsers=async(req,res)=>{
    try{
        const users=await User.find()
        res.json({
            sucess:true,
            data: users
        });
}
catch(e){
    res.json({
        sucess:false,
        message:"Failed to fetch users"
    });
}
}


const postBlogs = async (req, res) => {
  const { title, content, state, type } = req.body;
  const authorId = req.user?.id || req.body.authorId;

  if (!title || !content) {
    return res.status(400).json({ sucess: false, message: 'Title and content are required' });
  }

  try {
    const newBlog = new Blog({
      title,
      content,
      type: type || 'Technology',
      state: state || 'draft',
      authorId,
      slug: `temp-slug-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    });

    const savedBlog = await newBlog.save();

    const base = (title || 'post').toLowerCase().replace(/\s+/g, '-');
    savedBlog.slug = `${base}-${savedBlog._id}`.replace(/[^\w-]+/g, '');

    await savedBlog.save();

    const populated = await Blog.findById(savedBlog._id).populate('authorId', 'username email');
    return res.status(201).json({ sucess: true, data: populated });
  } catch (e) {
    console.error('postBlogs error:', e);
    return res.status(500).json({ sucess: false, message: 'Failed to create blog' });
  }
};  


const getBlogs=async(req,res)=>{
    try{
        const blogs=await Blog.find().populate("authorId","username email -_id")    
        res.json({
            sucess:true,
            data: blogs
        });
}   
catch(e){
    res.json({
        sucess:false,
        message:"Failed to fetch blogs"
    });
}
}

const getBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id).populate('authorId', 'username email');
    if (!blog) {
      return res.json({ sucess: false, message: 'Blog not found' });
    }
    return res.json({ sucess: true, data: blog });
  } catch (e) {
    console.error('getBlog error:', e);
    return res.json({ sucess: false, message: 'Failed to fetch blog' });
  }
};

const userBlogs = async (req, res) => {
  const { id } = req.params;
  try {

    const blogs = await Blog.find({ authorId: id })
      .populate('authorId', 'username email')
      .sort({ createdAt: -1 });
    
    return res.json({ sucess: true, data: blogs });
  } catch (e) {
    console.error("userBlogs error:", e);
    return res.json({ sucess: false, message: "Failed to fetch user blogs" });
  }
}


const deleteBlog=async(req,res)=>{
    const {id}=req.params;
    try{
        const blog=await Blog.findByIdAndDelete(id);    
        if(!blog){
            return res.json({
                sucess:false,
                message:"Blog Not Found"
            });
        }
        res.json({
            sucess:true,
            message:"Blog Deleted Successfully"
        });

    
}
catch(e){
    res.json({
        sucess:false,   
        message:"Failed to delete blog"
    });
}   
}

const getPublished = async (req, res) => {
  try {
    const blogs = await Blog.find({ state: "published" })
      .populate('authorId', 'username email')
      .sort({ createdAt: -1 });
    return res.json({ sucess: true, data: blogs });
  } catch (e) {
    console.error('getPublished error:', e);
    return res.json({ sucess: false, message: 'Failed to fetch published blogs' });
  }
};


const patchBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, state, type } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ sucess: false, message: 'Blog Not Found' });
    }

    const titleChanged = title && title !== blog.title;
    
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.state = state || blog.state;
    blog.type = type || blog.type;

    if (titleChanged) {
      const base = (blog.title || 'post').toLowerCase().replace(/\s+/g, '-');
      blog.slug = `${base}-${blog._id}`.replace(/[^\w-]+/g, '');
    }

    const updated = await blog.save();
    
    console.log('Blog updated:', updated._id, 'state:', updated.state);

    return res.json({ 
      sucess: true, 
      message: 'Blog Updated Successfully', 
      data: updated 
    });
  } catch (e) {
    console.error('patchBlog error:', e);
    return res.json({ sucess: false, message: 'Failed to update blog' });
  }
};

const postComment = async (req, res) => {
  const { blogId } = req.params;
  const { content, userId } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog || blog.state !== 'published') {
      return res.json({ sucess: false, message: 'Blog not found or not published' });
    }

    const comment = new Comment({
      content,
      blogId,
      userId
    });

    await comment.save();
    const populatedComment = await Comment.findById(comment._id).populate('userId', 'username email');

    res.json({ sucess: true, data: populatedComment });
  } catch (e) {
    console.error('postComment error:', e);
    res.json({ sucess: false, message: 'Failed to add comment' });
  }
};

const getComments = async (req, res) => {
  const { blogId } = req.params;

  try {
    const comments = await Comment.find({ blogId })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    res.json({ sucess: true, data: comments });
  } catch (e) {
    console.error('getComments error:', e);
    res.json({ sucess: false, message: 'Failed to fetch comments' });
  }
};


export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug }).populate('authorId', 'username email').lean();
    if (!blog) return res.status(404).json({ sucess: false, message: 'Blog not found' });

    if (blog.state === 'published' || blog.status === 'published') {
      return res.json({ sucess: true, data: blog });
    }

    const auth = req.headers.authorization || req.headers.Authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(404).json({ sucess: false, message: 'Blog not found' });
    const token = auth.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (String(decoded.id) === String(blog.authorId?._id)) return res.json({ sucess: true, data: blog });
    } catch (e) {}

    return res.status(404).json({ sucess: false, message: 'Blog not found' });
  } catch (e) {
    return res.status(500).json({ sucess: false, message: 'Server error' });
  }
};

export { postRegister, getUsers, getBlogs, postBlogs, getlogin, getBlog, userBlogs, deleteBlog, getPublished, patchBlog, postComment, getComments };