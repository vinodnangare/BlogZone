import express, { json } from 'express';
import dotenv from 'dotenv'
import mongoose, { get } from 'mongoose';
import cors from 'cors';
import { postRegister ,getUsers, getBlogs ,postBlogs, getlogin, getBlog, userBlogs,deleteBlog ,getPublished} from './controllers/controller.js';
dotenv.config({path:'../.env'});



const app= express();
app.use(express.json());
app.use(json());
app.use(cors());
const conn = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('DB Connect Successfully')
  } catch (e) {
    console.error('DB connection failed', e)
    // process.exit(1) // optionally exit so Render shows failure
  }
}

app.get('/',(req,res)=>{
    res.send("Tiny Blog Server Has Started")
});

app.post('/register', postRegister);
app.post('/login',getlogin);
app.get('/users',getUsers);
app.post('/blogs',postBlogs);
app.get('/blogs/:id',getBlog)
app.get('/blogs/user/:id',userBlogs);
app.get('/blogs',getBlogs);
app.delete('/blogs/:id',deleteBlog);
app.get('/published',getPublished); 
const PORT=process.env.PORT;
console.log(PORT)
app.listen(PORT ,()=>{
    conn()
    console.log(`Server is running on port http://localhost:${PORT}`)
})