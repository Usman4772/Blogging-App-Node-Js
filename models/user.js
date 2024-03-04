const {Schema,model} =require("mongoose")
const { createHmac,randomBytes } = require('crypto');
const { createTokenForUser } = require("../services/authentication");

const userSchema=new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        uniquue:true
    },
    salt:{
//search mongoose pre save example 
type:String
    },
    password:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        default:"/images/default-profile.png"


    },
    role:{
        type:String,
        enum:["USER","ADMIN"],//only these two values
        default:"USER"
    }

},{timestamp:true})


//for hashing password
userSchema.pre("save",function(next){
    const user=this;//points to the current user
    //if password not changed then don't do anything
    if(!user.isModified("password")) return 
    //use built in pckh crypto...then go to createHmac

    const salt=randomBytes(16).toString()//random string with wich we crypt our password
    // const hashedPassword=createHmac(algorithem,secrete).update(jisko hash krna ha).digest(hx me return kro )
    const hashedPassword=createHmac("sha256",salt).update(user.password).digest("hex")
    this.salt=salt;//db salt is set to salt
    this.password=hashedPassword
    next()
})


//for matching password again
userSchema.static("matchPasswordandGenerateToken",async function(email,password){
    const user=await this.findOne({email})
    if(!user) throw new Error("User not found")
    // user k hashed password to abi jo user ne password dia us se ko hash krny k baad compare krein gy agr same hua to login 
    const salt=user.salt;
    const hashedPassword=user.password;
    const providedPassword= createHmac("sha256",salt).update(password).digest("hex")
  if(hashedPassword!==providedPassword) throw new Error("Password not matched")
    // return hashedPassword===providedPassword//it will return boolean 

//    return user;
const token=createTokenForUser(user)
return token

})

module.exports=model("user",userSchema)