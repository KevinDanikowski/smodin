import {gql} from "react-apollo/index";

export const CREATE_POSTING_PLATFORM_MUTATION = gql`
     mutation CreatePostingPlatformMutation(
        $socialProfileId: ID!){
        createPostingPlatform(socialProfileId: $socialProfileId){
            id platform iftttKey iftttEventName zapierUrl 
        }
    }
`
export const UPDATE_POSTING_PLATFORM_MUTATION = gql`
     mutation UpdatePostingPlatformMutation(
        $id: ID!,
        $iftttKey: String,
        $iftttEventName: String,
        $zapierUrl: String){
        updatePostingPlatform(id: $id,
            iftttKey: $iftttKey,
            iftttEventName: $iftttEventName,
            zapierUrl: $zapierUrl){
            id platform iftttKey iftttEventName zapierUrl 
        }
    }
`