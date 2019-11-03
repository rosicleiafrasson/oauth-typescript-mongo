import {Schema, model} from 'mongoose'

const UserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username:{
        type:String
    },
    password:{
        type: String
    },
    job: {
        type: String
    },
    createDate: {
        type: Date,
        required: true
    },
    updateDate: {
        type: Date
    }

})

export default model ('User', UserSchema)