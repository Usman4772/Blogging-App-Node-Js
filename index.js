const express=require("express")
const path=require("path")
const app=express()
const userRouter=require("./routes/user")
const PORT=3000
const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/blogify")
app.set("view engine","ejs")
app.set("views",path.resolve("./views"))
app.use(express.urlencoded({ extended: false }))
app.use("/user",userRouter)//jo b user se start ho ga 

app.get("/",function(req,res){
    res.render("home")
})

//install nodemon -D ...which will not include nodemonmon when we deploy it
app.listen(PORT)