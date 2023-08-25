const express=require("express");
const logger=require("morgan");
const app=express();
app.use(logger('dev'));
app.listen(2000);
app.get("/",(req, res)=>{
    res.send(200);
})