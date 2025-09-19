import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({path:'../.env'});

const app= express();
app.use(express.json());

const conn=async (req,res)=>{
    try{
    await mongoose.connect(process.env.DB_URL);
   
    }
    
   catch(e){
    res.json({
        sucess:false,
        message:"Failed to connect with database"
    })
   }
   if(conn){
         console.log("DB Connect Successfully");
    }
}


app.get('/',(req,res)=>{
    res.send("Tiny Blog Server Has Started")
});

const PORT=process.env.PORT;
console.log(PORT)
app.listen(PORT ,()=>{
    conn()
    console.log(`Server is running on port http://localhost:${PORT}`)
})