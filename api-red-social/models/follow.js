const {Schema, model} = require('mongoose');

const FollowSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true,
        select : '-password -__v -role -email -created_at'
    },
    followed: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true,
        select : '-password -__v -role -email -created_at'
    },
    create_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model('Follow', FollowSchema, 'follows');