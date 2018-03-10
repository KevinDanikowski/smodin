import {gql} from "react-apollo/index";

export const ALL_INDUSTRIES_QUERY = gql`
  query AllIndustriesQuery {
    allIndustries {
          id
          industry
        }}`