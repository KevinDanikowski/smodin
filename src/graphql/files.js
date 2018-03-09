import { gql } from 'react-apollo'

export const UPDATE_FILE_MUTATION = gql`
    mutation UpdateFileMutation($id: ID!, $userId: ID!){
        updateFile(id: $id, userId: $userId){
            id size url
    }
}`
export const DELETE_FILE_MUTATION = gql`
    mutation DeleteFileMutation($id: ID!){
        deleteFile(id: $id){
                id
        }
}`