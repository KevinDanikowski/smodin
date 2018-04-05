const schedule = require('node-schedule')
const axios = require('axios')
const { request } = require('graphql-request')

const socialPostWithScheduleExample = {
    socialPost: {
        id: '',
        message: '',
        image: {
            url: ''
        }
    },
    schedule: {
        month: '1',
        date: 0,
        hour: '25',
        minute: '46'
    }
}

function scheduleSocialPost(socialPostAndSchedule, postingPlatform, inQueId) {
    let date = (
        '* '+ //0-59
        socialPostAndSchedule.schedule.minute+' '+//0-59
        socialPostAndSchedule.schedule.hour+' '+//0-23
        socialPostAndSchedule.schedule.date+' '+//1-31
        (socialPostAndSchedule.schedule.month + 1) //1-12
    )
    if (postingPlatform.platform === 'ifttt') {
        schedule.scheduleJob(date, axios.post(postingPlatform.iftttUrl, {
            value1: socialPostAndSchedule.message,
            value2: '',
            value3: (socialPostAndSchedule.image.url)? socialPostAndSchedule.image.url: ''
        })).then(function (response) {
            //update social post last updated, delete socialpostinque
        }).catch(function (err) {

        })
    }
    if (postingPlatform.platform === 'zapier') {

    }
    /*IFTTT post request
    INSTRUCTIONS: go to services -> documentation -> copy key or use to see example. Get even trigger from name
    example trigger names: 'smodin_facebook_message', 'smodin_linkedin_linkpost', etc.
    post to https://maker.ifttt.com/trigger/__EVENT__/with/key/__KEY__
    https://maker.ifttt.com/use/c408ZHudPSGRrwsOGHmcTn
    {"value1": "...", "value2": "...", "value3": "..."} - message, link, imageurl
    for zapier: https://zapier.com/hooks/catch/n/Lx2RH/
     */
    //schedule.scheduleJob(date, function(){console.log(date)})
}

//update socialPost last updated
//delete socialpostinque

scheduleSocialPost(socialPostWithScheduleExample)

module.exports = {
    scheduleSocialPost
}