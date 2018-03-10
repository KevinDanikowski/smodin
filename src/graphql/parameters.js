import {gql} from "react-apollo/index";

export const ALL_PARAMETERS_QUERY = gql`
  query AllParametersQuery ($socialProfileId: ID!) {
    allParameters (orderBy: default_DESC, filter: { 
        socialProfile: {
            id: $socialProfileId
            }
        }){
          id
          default
          param
          response
        }}`
export const ADD_PARAMETER_MUTATION = gql`
    mutation AddParameterMutation($socialProfileId: ID!, $param: String!, $response: String!){
        createParameter(socialProfileId: $socialProfileId, param: $param, response: $response){
            param
            response
            id
            default
            socialProfile {id}
    }}`
export const UPDATE_PARAMETER_MUTATION = gql`
    mutation UpdateParameterMutation( $id: ID!, $param: String!, $response: String!){
        updateParameter( id: $id,  param: $param, response: $response){
            id
            param
            response
            socialProfile {id}
    }}`
export const DELETE_PARAMETER_MUTATION = gql`
  mutation DeleteParameterMutation($id: ID!) {
    deleteParameter(id: $id) {
      id
    }
  }
`