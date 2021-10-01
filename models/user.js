const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const SALT_ROUNDS = 10

const UserSchema =  mongoose.Schema(
    {
        name:{
            type: String,
            trim:true,
            required: [true,"Name is required"]
        },

        email:{
            type: String,
            trim:true,
            lowercase:true,
            required: [true,"Email is required"],
            index: {
                unique: true
            },
            minlength: [6, "Email cannot be shorter than 64 characters"],
            maxlength: [64, "Email cannot be longer than 64 characters"]
        },

        password: {
            type : String,
            required: [true,"Password is required"],
            select: false
        }


    },

    {
        timestamps : true
    }

)

UserSchema.path('email').validate(async function (value) {
    const emailCount = await mongoose.models.User.countDocuments({email:this.email}).exec()
    return !emailCount;
}, 'Email already exists')

UserSchema.pre('save', function(next) {

    if(!this.isModified('password')) return next()

    bcrypt.hash(this.password, SALT_ROUNDS,(err, hash) => {

        if(err) return next(err)

        this.password = hash
        
        next()
    })

})



const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel