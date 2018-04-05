const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialPostInQueSchema = new Schema({
    userId: Id,
    socialPost: {
        id: chosenSocialPost.id,
        message: chosenSocialPost.message,
        image: {
            url: chosenSocialPost.image.url
        }
    },
    schedule: {
        month: schedule.month,
        date: schedule.date,
        hour: schedule.hour,
        minute: schedule.minute
    }
});

module.exports = mongoose.model('SocialPostInQue', SocialPostInQueSchema);