import {faFacebookSquare, faLinkedin, faTwitterSquare} from "@fortawesome/fontawesome-free-brands/index";

export const tabsMenu = [
    {tab: 'posts', display: 'Posts', icon: 'fa-pencil'},
    {tab: 'parameters', display: 'Parameters', icon: 'fa-commenting'},
    {tab: 'schedule', display: 'Schedule', icon: 'fa-calendar'},
    {tab: 'queue', display: 'Queue', icon: 'fa-tasks'},
    {tab: 'settings', display: 'Settings', icon: 'fa-gear'},
]
export const GC_USER_ID = 'graphcool-user-id'
export const GC_AUTH_TOKEN = 'graphcool-auth-token'
export const sampleSocialProfile = {
    id: null,
    site: 'facebook',
    industry: {
        id: null
    }
}
export const profileIcons = [
    {profile: 'facebook', icon: faFacebookSquare, color: '#3b5998'},
    {profile: 'twitter', icon: faTwitterSquare, color: '#55acee'},
    {profile: 'linkedin', icon: faLinkedin, color: '#007bb5'}
]
export const socialProfiles = [
    {display: 'FB', profile: 'facebook'},
    {display:'T', profile: 'twitter'},
    {display: 'LI', profile: 'linkedin'}]
export const monthlyDates = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15',
    '16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
export const monthlyDayPositions = [
    {position: '1st', number: '1'},
    {position: '2nd', number: '2'},
    {position: '3rd', number: '3'},
    {position: '4th', number: '4'},
    {position: 'Every', number: '5'}
    ]
export const hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15',
    '16','17','18','19','20','21','22','23']
export const minutes = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15',
    '16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34',
    '35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53',
    '54','55','56','57','58','59']
export const dayArray = [{number: '1', day: 'Monday', dayShort: 'Mon'},
    {number: '2', day: 'Tuesday', dayShort: 'Tue'},
    {number: '3', day: 'Wednesday', dayShort: 'Wed'},
    {number: '4', day: 'Thursday', dayShort: 'Thr'},
    {number: '5', day: 'Friday', dayShort: 'Fri'},
    {number: '6', day: 'Saturday', dayShort: 'Sat'},
    {number: '7', day: 'Sunday', dayShort: 'Sun'}
    ]
export const buildTimeFrames = [
    {display: '1 month', number: '1'},
    {display: '2 months', number: '2'},
    {display: '3 months', number: '3'},
    {display: '4 months', number: '4'},
    {display: '5 months', number: '5'},
    {display: '6 months', number: '6'}
    ]
export const defaultWeeklyPostSchedules = [
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
export const defaultMonthlyDatePostSchedules = [
    {monthlyScheduleType: 'monthDate', monthDate: '01', monthDay: '', hour: '11', minute: '13'},
    {monthlyScheduleType: 'monthDate', monthDate: '03', monthDay: '', hour: '14', minute: '15'},
    {monthlyScheduleType: 'monthDate', monthDate: '05', monthDay: '', hour: '17', minute: '05'},
    {monthlyScheduleType: 'monthDate', monthDate: '10', monthDay: '', hour: '12', minute: '15'},
    {monthlyScheduleType: 'monthDate', monthDate: '14', monthDay: '', hour: '13', minute: '32'},
    {monthlyScheduleType: 'monthDate', monthDate: '18', monthDay: '', hour: '12', minute: '16'},
    {monthlyScheduleType: 'monthDate', monthDate: '21', monthDay: '', hour: '16', minute: '34'},
    {monthlyScheduleType: 'monthDate', monthDate: '25', monthDay: '', hour: '09', minute: '34'},
    {monthlyScheduleType: 'monthDate', monthDate: '28', monthDay: '', hour: '13', minute: '15'}
    ]
export const defaultMonthlyDayPostSchedules = [
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '15', hour: '11', minute: '13'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '23', hour: '14', minute: '15'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '32', hour: '17', minute: '05'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '41', hour: '12', minute: '15'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '44', hour: '13', minute: '32'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '53', hour: '12', minute: '16'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '16', hour: '16', minute: '34'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '27', hour: '09', minute: '34'},
    {monthlyScheduleType: 'monthDay', monthDate: '', monthDay: '37', hour: '13', minute: '15'}
    ]
export const sampleEvents = [
    {
        title: 'All Day Event',
        start: '2018-05-01'
    },
    {
        title: 'Long Event',
        start: '2018-05-07',
        end: '2018-05-10'
    },
    {
        id: 999,
        title: 'Repeating Event',
        start: '2018-05-09T16:00:00'
    },
    {
        id: 999,
        title: 'Repeating Event',
        start: '2018-05-16T16:00:00'
    },
    {
        title: 'Conference',
        start: '2018-05-11',
        end: '2018-05-13'
    },
    {
        title: 'Meeting',
        start: '2018-05-12T10:30:00',
        end: '2018-05-12T12:30:00'
    },
    {
        title: 'Birthday Party',
        start: '2018-05-13T07:00:00'
    },
    {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2018-05-28'
    }
]