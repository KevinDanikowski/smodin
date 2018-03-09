import {gql} from "react-apollo/index";

export const ALL_INDUSTRIES_QUERY = gql`
  query AllIndustriesQuery ($id: ID!) {
    allIndustries (orderBy: default_DESC filter:{
        users_some: {
            id: $id
            }
        }){
          id
          default
          industry
        }}`