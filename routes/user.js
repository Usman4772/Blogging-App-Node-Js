const {Router}=require("express")
const User=require("../models/user")
const router=Router()
router.get("/signup",(req,res)=>{
    return res.render("signup")
})
router.get("/signin",(req,res)=>{
    return res.render("signin")
})
router.post("/signup",async (req,res)=>{
    const {fullName,email,password}=req.body
 await User.create({
        fullName,
        email,
        password
    })
    return res.redirect("/")

})
router.post("/signin",async (req,res)=>{
    const {email,password}=req.body
   const token=await User.matchPasswordandGenerateToken(email,password)
   console.log("token",token)
   res.redirect("/")
})
module.exports=router