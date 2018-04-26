import { gql } from 'react-apollo'

export const ALL_SOCIAL_POSTS_QUERY = gql`
  query AllSocialPostsQuery ($socialProfileId: ID!, $searchText: String!) {
    allSocialPosts (orderBy: default_DESC, filter:{AND: [{
            socialProfile: {
                id: $socialProfileId
                }
        },{
        message_contains: $searchText
      }]}){
          id
          updatedAt
          default
          message
          socialProfile {id}
          image {id size url}
        }}`

export const ADD_SOCIAL_POSTS_MUTATION = gql`
    mutation AddSocialPostMutation($message: String!, $socialProfileId: ID!){
        createSocialPost(message: $message, socialProfileId: $socialProfileId){
            message
            id
            default
            socialProfile {id}
            image {id size url}
    }}`

export const UPDATE_SOCIAL_POSTS_IMAGE_MUTATION = gql`
    mutation UpdateSocialPostImage($id: ID!, $imageId: ID!){
        updateSocialPost(id: $id, imageId: $imageId){
            message
            id
            default
            socialProfile {id}
            image {id size url}
    }}`
export const UPDATE_SOCIAL_POSTS_MUTATION = gql`
    mutation UpdateSocialPost($id: ID!, $message: String!){
        updateSocialPost(id: $id, message: $message){
            id
            message
    }}`
export const DELETE_SOCIAL_POSTS_MUTATION = gql`
  mutation DeletedSocialPostMutation($id: ID!) {
    deleteSocialPost(id: $id) {
      id
    }
  }
`
export const ADD_SOCIAL_POST_IMAGE_MUTATION = gql`
    mutation AddSocialPostImageMutation($socialPostId: ID!, $secret: String!, $name: String!, $size: Int!, $url: String!, $contentType: String!){
        createSocialPostImage(socialPostId: $socialPostId, secret: $secret, name: $name, size: $size, url: $url, contentType: $contentType){
            id secret name size url contentType
    }
}`

export const ALL_SOCIAL_POST_EXAMPLES_QUERY = gql`
  query AllSocialPostExamplesQuery ($industryId: ID!) {
    allSocialPostExamples (filter:{
        industries_some: {
            id: $industryId
            }
        }){
          id
          message
        }}`
export const ALL_SOCIAL_POST_IDEAS_QUERY = gql`
  query AllSocialPostIdeasQuery ($industryId: ID!) {
    allSocialPostIdeas (filter:{
        industries_some: {
            id: $industryId
            }
        }){
          id
          idea
        }}`
//todo check if this works once API is running
export const ALL_SCHEDULED_POSTS_QUERY = gql`
    query AllScheduledPostsQuery ($socialProfileId: ID!) {
        allScheduledPosts(socialProfileId: $socialProfileId){
        id
    }}`