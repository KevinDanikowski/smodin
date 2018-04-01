import {gql} from "react-apollo/index";

export const ALL_POST_SCHEDULES_QUERY = gql`
    query AllPostSchedulesQuery ($socialProfileId: ID!) {
    allPostSchedules (filter:{
            socialProfile: {
                id: $socialProfileId
                }
        }){
          id
          scheduleType
          weeklySchedules {id day hour minute}
          monthlySchedules {id monthlyScheduleType monthDate monthDay hour minute}
    }}`
export const ALL_WEEKLY_POST_SCHEDULES_QUERY = gql`
    query AllWeeklyPostSchedules ($socialProfileId: ID!) {
    allWeeklyPostSchedules (filter:{
            socialProfile: {
                id: $socialProfileId
                }
        }){
          id day hour minute
    }}`
export const ALL_MONTHLY_POST_SCHEDULES_QUERY = gql`
    query AllMonthlyPostSchedules ($socialProfileId: ID!) {
    allMonthlyPostSchedules (filter:{
            socialProfile: {
                id: $socialProfileId
                }
        }){
         id monthlyScheduleType monthDate monthDay hour minute
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
    mutation AddWeeklyPostScheduleMutation($day: String!, $hour: String!, $minute: String!, $socialProfileId: ID!){
        createWeeklyPostSchedule(socialProfileId: $socialProfileId, day: $day, hour: $hour, minute: $minute){
            id 
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
            $socialProfileId: ID!){
        createMonthlyPostSchedule(
                monthlyScheduleType: $monthlyScheduleType,
                monthDate: $monthDate,
                monthDay: $monthDay,
                hour: $hour,
                minute: $minute,
                socialProfileId: $socialProfileId
            ){
                id 
                monthlyScheduleType
                monthDate
                monthDay
                hour
                minute
    }}`