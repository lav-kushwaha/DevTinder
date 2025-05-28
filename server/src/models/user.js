const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

//userSchema.
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3, //for string we use minLength and maxLength
        maxLength:100,
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        // index : true,//index we are using to make query fast.
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){ //validator
                throw new Error("Invalid email address: " + value);
            }
        },
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password:"+ value);
            }
        }
    },
    age:{
        type:Number,
        min:18,//for num we use min
    },
    gender:{
        type:String,
        // enum:{
        //     values: ["male","female","other"],
        //     message:`${VALUES} is not a valid gender`
        // },
        validate(value){
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Gender data is not valid!");
            }
        }
    },
    isPremium :{
        type:Boolean,
        default:false
    },
    membershipType:{
        type:String,
    },
    photoUrl:{
        type:String,
        default:"https://conferenceoeh.com/wp-content/uploads/profile-pic-dummy.png",
        validate(value){
            if(!validator.isURL(value)){ //validator
                throw new Error("Invalid photo URL : " + value);
            }
        }
    },
    about:{
        type:String,
        default:"This is a default about of the user!"
    },
    skills:{
        type:[String],
    }
},
{
    timestamps:true,
});

//compound Index - Index are use to make out query fast in database.
//1 means ascending order and -1 means descending order.
//index :true, - we can also use like this index in schema.
// userSchema.index({firstName:1});
// userSchema.index({gender:1});


//getJWT - jsonwebtoken.
userSchema.methods.getJWT = async function() {
    const user = this;

    const token = await jwt.sign({_id:user._id},"DEV@Tinder$790",{
        expiresIn:"7d",
    });

    return token;
}

//bcrypt - validatePassword.
userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
}

// const User = mongoose.model("User",userSchema);

module.exports = mongoose.model("User",userSchema);