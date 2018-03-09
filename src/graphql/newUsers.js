import {gql} from "react-apollo/index";

//TODO FIX ALL THESE DEFAULTS OT ADD APPROPRIATELY WITHOUT INDUSTRY IDS AND STUFF

export const ADD_ALL_DEFAULT_SOCIAL_POSTS_ONE_BY_ONE_MUTATION = gql`
  mutation AddAllDefaultSocialPostsOneByOneMutation(
        $userId: ID!, $industriesIds: [ID!], $message: String!){
    createSocialPost(userId: $userId, message: $message, 
    industriesIds: $industriesIds) {
    id default message industries {id}
  }
}`
export const ADD_ALL_DEFAULT_PARAMETERS_ONE_BY_ONE_MUTATION = gql`
  mutation AddAllDefaultParametersOneByOneMutation(
        $userId: ID!, $industriesIds: [ID!], $param: String!, $response: String!, $default: Boolean!){
    createParameter(userId: $userId, param: $param, response: $response, default: $default,
    industriesIds: $industriesIds) {
    id default param response industries {id}
  }
}`
export const ADD_ALL_DEFAULT_INDUSTRIES_ONE_BY_ONE_MUTATION = gql`
    mutation UpdateUserIndustries($industryId: ID!, $userId: ID!){
        addToUserIndustries(usersUserId: $userId, industriesIndustryId: $industryId){
            industriesIndustry {id}
        }}`
export const ALL_DEFAULT_SOCIAL_POSTS_QUERY = gql`
  query AllSocialPostsQuery {
    allDefaultSocialPosts {
          id
          message
          industries {id}
        }}`
export const ALL_DEFAULT_PARAMETERS_QUERY = gql`
  query AllDefaultParametersQuery {
    allDefaultParameters {
          id
          param
          response
          industries {id}
        }}`
//todo may not need this default industries thing
export const ALL_DEFAULT_INDUSTRIES_QUERY = gql`
  query AllDefaultIndustriesQuery {
    allIndustries ( filter: { default: true }){
          id
        }}`