import {gql} from "react-apollo/index";

export const ALL_SOCIAL_PROFILES_QUERY = gql`
  query AllSocialProfilesQuery ($id: ID!) {
    allSocialProfiles (filter: {user: {id: $id}}){
          id site industry {id} name
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
            id site industry {id industry} name
        }
    }
`