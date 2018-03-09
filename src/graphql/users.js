import { gql } from 'react-apollo'

export const USER_SETTINGS_QUERY = gql`
  query UserSettingsQuery($id: ID!) {
    User(id: $id) {
      id
      name
      email
      mainSocialProfile { id site }
    }
  }
`

export const UPDATE_USER_NAME_MUTATION = gql`
    mutation UpdateUserName($id: ID!, $name: String!){
        updateUser(id: $id, name: $name){
            id
            name
    }}`