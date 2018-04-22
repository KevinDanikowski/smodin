import {gql} from "react-apollo/index";

export const CREATE_POSTING_PLATFORM_MUTATION = gql`
     mutation CreatePostingPlatformMutation(
        $socialProfileId: ID!){
        createPostingPlatform(socialProfileId: $socialProfileId){
            id platform iftttKey iftttEventName zapierUrl 
        }
    }
`
export const DELETE_POSTING_PLATFORM_MUTATION = gql`
     mutation DeletePostingPlatformMutation(
        $id: ID!){
        deletePostingPlatform(id: $id){
            id 
        }
    }
`
export const UPDATE_POSTING_PLATFORM_MUTATION = gql`
     mutation UpdatePostingPlatformMutation(
        $id: ID!,
        $platform: PostingPlatformsEnum,
        $iftttKey: String,
        $iftttEventName: String,
        $zapierUrl: String){
        updatePostingPlatform(id: $id,
            platform: $platform,
            iftttKey: $iftttKey,
            iftttEventName: $iftttEventName,
            zapierUrl: $zapierUrl){
            id platform iftttKey iftttEventName zapierUrl 
        }
    }
`