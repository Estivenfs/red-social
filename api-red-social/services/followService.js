const Follow = require('../models/follow');

const followUserIds = async (userId) => {
    try {
        const follows = await Follow.find({ user: userId }).select({ '_id': 0, '__v': 0, 'user': 0 });
        const follows_clean = [];
        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });
        const followers_clean = [];
        const followers = await Follow.find({ followed: userId }).select({ '_id': 0, '__v': 0, 'followed': 0 });
        followers.forEach((follower) => {
            followers_clean.push(follower.user);
        });
        return { follows: follows_clean, followers: followers_clean };
    } catch (error) {
        return {};
    }

}
const followThisUser = async (userId, followedId) => {
    const follow = await Follow.findOne({ user: userId, followed: followedId });
    const follower = await Follow.findOne({ user:followedId ,followed: userId });
    return {
        following: follow,
        follower: follower
    }
}

module.exports = {
    followUserIds,
    followThisUser
}