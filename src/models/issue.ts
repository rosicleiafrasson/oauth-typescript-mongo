import {Schema, model, Mongoose} from 'mongoose'

const IssueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    userReporter: {
    },
    userAssign: {
    }
})

export default model ('Issue', IssueSchema)
