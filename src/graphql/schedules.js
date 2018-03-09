import {gql} from "react-apollo/index";

export const ALL_POST_SCHEDULES_QUERY = gql`
    query AllPostSchedulesQuery ($id: ID!, $industryId: ID!) {
    allPostSchedules (filter:{AND: [{
        user: {
            id: $id
            }
        },{
            industry: {
                id: $industryId
                }
        }]}){
          id
          scheduleType
          weeklySchedules {id day hour minute}
          monthlySchedules {id monthlyScheduleType monthDate monthDay hour minute}
    }}`
export const DELETE_WEEKLY_POST_SCHEDULE_MUTATION = gql`
  mutation DeletedWeeklyPostScheduleMutation($id: ID!) {
    deleteWeeklyPostSchedule(id: $id) {
      id
    }
  }
`
export const DELETE_MONTHLY_POST_SCHEDULE_MUTATION = gql`
  mutation DeletedMonthlyPostScheduleMutation($id: ID!) {
    deleteMonthlyPostSchedule(id: $id) {
      id
    }
  }
`
export const ADD_WEEKLY_POST_SCHEDULE_MUTATION = gql`
    mutation AddWeeklyPostScheduleMutation($day: String!, $hour: String!, $minute: String!, $postScheduleId: ID!){
        createWeeklyPostSchedule(scheduleId: $postScheduleId, day: $day, hour: $hour, minute: $minute){
            id 
            schedule {id}
            day
            hour
            minute
    }}`
export const ADD_MONTHLY_POST_SCHEDULE_MUTATION = gql`
    mutation AddMonthlyPostScheduleMutation(
            $monthlyScheduleType: String!,
            $monthDate: String!,
            $monthDay: String!, 
            $hour: String!, 
            $minute: String!, 
            $postScheduleId: ID!){
        createMonthlyPostSchedule(
                monthlyScheduleType: $monthlyScheduleType,
                monthDate: $monthDate,
                monthDay: $monthDay,
                hour: $hour,
                minute: $minute,
                scheduleId: $postScheduleId
            ){
                id 
                schedule {id}
                monthlyScheduleType
                monthDate
                monthDay
                hour
                minute
    }}`