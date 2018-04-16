import {gql} from "react-apollo/index";

//todo get rid of this, have it in user data
export const ALL_SOCIAL_PROFILES_QUERY = gql`
  query AllSocialProfilesQuery ($id: ID!) {
    allSocialProfiles (filter: {user: {id: $id}}){
          id site name
          industry {id industry} 
          weeklySchedules { id day hour minute }
          monthlySchedules { id monthlyScheduleType monthDay monthDate hour minute }
          postingPlatform { id platform iftttEventName iftttKey zapierUrl }
        }}`
export const CREATE_SOCIAL_PROFILE_MUTATION = gql`
    mutation CreateSocialProfileMutation(
        $userId: ID!,
        $site: String!,
        $industryId: ID!,
        $name: String!){
        createSocialProfile(
            userId: $userId,
            site: $site,
            industryId: $industryId,
            name: $name){
            id site name 
            industry { id industry }
            weeklySchedules { id day hour minute }
            monthlySchedules { id monthlyScheduleType monthDay monthDate hour minute }
            postingPlatform { id platform iftttEventName iftttKey zapierUrl }
        }
    }
`
//todo filter for industry
export const ALL_DEFAULT_SOCIAL_POSTS_QUERY = gql`
  query AllSocialPostsQuery($industryId: ID!) {
    allDefaultSocialPosts(filter: {
        industry: {
            id: $industryId
            }
        }){
          id
          message
        }}`
export const ALL_DEFAULT_PARAMETERS_QUERY = gql`
  query AllDefaultParametersQuery($industryId: ID!) {
    allDefaultParameters (filter: {
        industry: {
            id: $industryId
            }
        }){
          id
          param
          response
        }}`
export const ADD_ALL_DEFAULT_SOCIAL_POSTS_ONE_BY_ONE_MUTATION = gql`
  mutation AddAllDefaultSocialPostsOneByOneMutation($socialProfileId: ID!, $message: String!){
    createSocialPost(socialProfileId: $socialProfileId, message: $message) {
    id default message socialProfile {id}
  }
}`
export const ADD_ALL_DEFAULT_PARAMETERS_ONE_BY_ONE_MUTATION = gql`
  mutation AddAllDefaultParametersOneByOneMutation(
        $socialProfileId: String!, $param: String!, $response: String!, $default: Boolean!){
    createParameter(param: $param, response: $response, default: $default, socialProfileId: $socialProfileId) {
    id default param response socialProfile {id}
  }
}`