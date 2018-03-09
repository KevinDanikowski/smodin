import {gql} from "react-apollo/index";

export const ALL_PARAMETERS_QUERY = gql`
  query AllParametersQuery ($id: ID!, $industryId: ID!) {
    allParameters (orderBy: default_DESC, filter: {AND: [{
        user: {
            id: $id
            }
        },{
        industries_some: {
            id: $industryId
            }
        }]}){
          id
          default
          param
          response
          industries {id}
        }}`
export const ADD_PARAMETER_MUTATION = gql`
    mutation AddParameterMutation( $userId: ID!, $industriesIds: [ID!], $param: String!, $response: String!){
        createParameter( userId: $userId,  industriesIds: $industriesIds, param: $param, response: $response){
            param
            response
            id
            default
            industries {id}
    }}`
export const UPDATE_PARAMETER_MUTATION = gql`
    mutation UpdateParameterMutation( $id: ID!, $param: String!, $response: String!){
        updateParameter( id: $id,  param: $param, response: $response){
            id
            param
            response
    }}`
export const DELETE_PARAMETER_MUTATION = gql`
  mutation DeleteParameterMutation($id: ID!) {
    deleteParameter(id: $id) {
      id
    }
  }
`