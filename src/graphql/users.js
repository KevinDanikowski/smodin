import { gql } from 'react-apollo'

export const USER_SETTINGS_QUERY = gql`
  query UserSettingsQuery($id: ID!) {
    User(id: $id) {
      id
      name
      email
    }
  }
`

export const UPDATE_USER_NAME_MUTATION = gql`
    mutation UpdateUserName($id: ID!, $name: String!){
        updateUser(id: $id, name: $name){
            id
            name
    }}`
export const SIGNIN_USER_MUTATION = gql`
  mutation SigninUserMutation($email: String!, $password: String!) {
    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`
export const CREATE_USER_MUTATION = gql`
  mutation CreateUserMutation($name: String!, $email: String!, $password: String!) {
    createUser(
      name: $name,
      authProvider: {
        email: {
          email: $email,
          password: $password
        }
      }
    ) {
      id
    }

    signinUser(email: {
      email: $email,
      password: $password
    }) {
      token
      user {
        id
      }
    }
  }
`