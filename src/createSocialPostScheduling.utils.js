const moment = require('moment')
const _ = require('underscore')
const date = new Date()
const month = (date.getMonth() + 1)
/*
const defaultWeeklyPostSchedules = [
    {day: '1', hour: '11', minute: '27'},
    {day: '2', hour: '14', minute: '34'},
    {day: '2', hour: '17', minute: '21'},
    {day: '3', hour: '12', minute: '56'},
    {day: '4', hour: '13', minute: '06'},
    {day: '5', hour: '12', minute: '42'},
    {day: '5', hour: '16', minute: '52'},
    {day: '6', hour: '09', minute: '37'},
    {day: '7', hour: '13', minute: '15'}
]
const defaultMonthlyPostSchedules = [
    {monthlyScheduleType: 'monthDate', monthDate: '01', monthDay: '', hour: '11', minute: '11'},
    {monthlyScheduleType: 'monthDate', monthDate: '03', monthDay: '', hour: '12', minute: '12'},
    {monthlyScheduleType: 'monthDate', monthDate: '05', monthDay: '', hour: '13', minute: '13'},
    {monthlyScheduleType: 'monthDate', monthDate: '10', monthDay: '', hour: '14', minute: '14'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '15', hour: '15', minute: '15'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '23', hour: '16', minute: '16'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '32', hour: '17', minute: '17'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '41', hour: '18', minute: '18'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '44', hour: '19', minute: '19'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '53', hour: '20', minute: '20'},
]*/
export const socialPostsArray = [
    {id: '1', message: 'message here', image: {id: '1', url: 'www.testurl.com'}, lastPosted: '20171209'},
    {id: '2', message: 'message 2', image: {id: '2', url: 'www.ota.ai'}, lastPosted: '20171101'},
    {id: '3', message: 'message 3', image: {id: '3', url: 'www.smo.ai'}, lastPosted: ''},
    {id: '4', message: 'message 4', image: {id: '4', url: 'www.okie.ai'}, lastPosted: ''},
]

export function createSocialPostScheduling(scheduleType,scheduleDuration,weeklySchedules,monthSchedules,socialPostsArray) {
    let postSchedules = []
    if (scheduleType === 'weekly') {
        postSchedules = setWeeklySchedules(weeklySchedules, scheduleDuration)
    }
    if (scheduleType === 'monthly') {
        postSchedules = setMonthlySchedules(monthSchedules, scheduleDuration)
    }
    const sortedSocialPostsArray = _.sortBy(socialPostsArray, 'lastPosted')
    let lastSocialPostIndex = 0
    const socialPostsSchedulingArray = postSchedules.map(schedule => {
        let chosenSocialPost = sortedSocialPostsArray[lastSocialPostIndex]
        if (!chosenSocialPost) {
            lastSocialPostIndex = 0
            chosenSocialPost = sortedSocialPostsArray[lastSocialPostIndex]
        }
        lastSocialPostIndex = lastSocialPostIndex + 1
        const socialPostWithSchedule = {
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
        }
        return socialPostWithSchedule
    })
    return socialPostsSchedulingArray
}
function dateArrayBetweenDates(startDate, stopDate) {
    /* Format YYYYMMDD */
    let dateArray = []
    let currentDate = startDate
    while (currentDate <= stopDate){
        function dayPosition() {
            let firstDayOfMonth = moment(currentDate).startOf('month')._d.getDay()
            let firstDateOfMonth = moment(currentDate).startOf('month')._d.getDate()
            let date = moment(currentDate)._d.getDate()
            let day = moment(currentDate)._d.getDay()
            let daysFromFirst = (date - firstDateOfMonth)
            let dayLog = firstDayOfMonth
            let dayPosition = 1
            while (daysFromFirst !== 0){
                if (day === dayLog) { dayPosition = (dayPosition + 1) }
                if (dayLog !== 6) {
                    dayLog = (dayLog + 1)
                } else {dayLog = 0}
                daysFromFirst = (daysFromFirst - 1)
            }
            return dayPosition
        }
        dateArray.push({
            month: moment(currentDate)._d.getMonth(),
            date: moment(currentDate)._d.getDate(),
            day: moment(currentDate)._d.getDay(),
            dayPosition: dayPosition()})
        currentDate = moment(currentDate).add(1, 'days').format('YYYYMMDD')
    }
    return dateArray
}
function setMonthlySchedules(monthSchedules, scheduleDuration) {
    const dateUntil = moment().startOf(month).add(scheduleDuration, 'month').format('YYYYMMDD')
    const dateArrays = dateArrayBetweenDates(moment().format('YYYYMMDD'), dateUntil)
    let outputArray = []
    const monthlyDateSchedules = monthSchedules.filter(schedule => {if (schedule.monthlyScheduleType === 'monthDate') return schedule})
    dateArrays.map(object => {
        const schedulesMatchingDay = monthlyDateSchedules.filter(monthlyDateSchedule => {
            if (object.date.toString().length === 1) object.date = '0'.concat(object.date.toString())
            if (monthlyDateSchedule.monthDate === object.date.toString()) return monthlyDateSchedule
        })
        schedulesMatchingDay.map(monthlyDateSchedule => {
            outputArray.push({month: object.month, date: object.date, hour: monthlyDateSchedule.hour, minute: monthlyDateSchedule.minute})
        })
    })
    const monthlyDaySchedules = monthSchedules.filter(schedule => {if (schedule.monthlyScheduleType === 'monthDay') {
        return schedule
    }})
    dateArrays.map(object => {
        const schedulesMatchingDay = monthlyDaySchedules.filter(monthlyDaySchedule => {
            if ((object.dayPosition.toString() === monthlyDaySchedule.monthDay.substr(0,1))&&(object.day.toString() === monthlyDaySchedule.monthDay.substr(1,2))){
                return monthlyDaySchedule
            }
        })
        schedulesMatchingDay.map(monthlyDaySchedule => {
            outputArray.push({month: object.month, date: object.date, hour: monthlyDaySchedule.hour, minute: monthlyDaySchedule.minute})
        })
    })
    return outputArray
}
function setWeeklySchedules(weeklySchedules, scheduleDuration) {
    const dateUntil = moment().startOf(month).add(scheduleDuration, 'month').format('YYYYMMDD')
    const dateArrays = dateArrayBetweenDates(moment().format('YYYYMMDD'), dateUntil)
    let outputArray = []
    dateArrays.map(object => {
        const schedulesMatchingDay = weeklySchedules.filter(weeklySchedule => {
            if (weeklySchedule.day === (object.day + 1).toString()) return weeklySchedule
        })
        schedulesMatchingDay.map(weeklySchedule => {
            outputArray.push({month: object.month, date: object.date, hour: weeklySchedule.hour, minute: weeklySchedule.minute})
        })
    })
    return outputArray
}

//let test = createSocialPostScheduling('monthly', 1, defaultWeeklyPostSchedules, defaultMonthlyPostSchedules, socialPostsArray)
