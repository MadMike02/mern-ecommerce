import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import path from "path";
import morgan from 'morgan';

import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import UploadRoutes from "./routes/UploadRoutes.js";

// const express = require('express')
// const products = require('./data/products')
// const dotenv = require('dotenv')
const app = express();

if(process.env.NODE_ENV==='development'){
  app.use(morgan('dev')); //will show log of all routes on terminal in proper format
}

app.use(express.json());
// app.use((req, res, next)=>{
//     const error = new Error(`Not Found - ${req.originalUrl} `)
//     res.status(404)
//     next({error})
// })

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: "something wrong",
    stack: process.env.NODE_ENV === "production" ? null : "stack",
  });
});

//middleware
// app.use((req,res, next)=>{
//     console.log('hello')
//     next()
// })

dotenv.config();
connectDB();



app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", UploadRoutes);

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

//making folder static for access though web page
const __dirname = path.resolve() //if not using es6
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if(process.env.NODE_ENV==='production'){
  //for setting static path of production build
  app.use(express.static(path.join(__dirname, "/Fronted/build")));

  //for any routes use other than defined in backend it will give the index file of build
  app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'Fronted','build','index.html')))

}else{
  app.get("/", (req, res) => {
    res.send("api running");
  });
}

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `server running at ${PORT} in ${process.env.NODE_ENV}`.yellow.bold
  )
);
