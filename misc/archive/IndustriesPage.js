import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import { GC_USER_ID } from '../../src/constants'
import Industry from './Industry'
import {ALL_INDUSTRIES_QUERY} from "../../src/graphql/industries";
import './IndustriesPage.css'

class IndustriesPage extends Component {
    render() {
        const GenericIndustry = () => {
            return (
                <div className='ma3 mw300p'>
                    <div className='industry-box-user flex items-center h-100'>
                        <div className='pt1 pb1 fw4 black flex-1 text-capitalize ma1 ml2'>Generic</div>
                    </div>
                </div>
            )

        }
        const userId = localStorage.getItem(GC_USER_ID)
        if (!userId){
            return(
                <div>
                    <h1 className="tc">Oops! You are not logged in!</h1>
                    <button onClick={() => {
                        this.props.history.push('/login')
                    }}>Login
                    </button>
                </div>
            )
        }
        const IndustryArrayMap = () => {
            if ((this.props.allIndustriesNoFilterQuery && this.props.allIndustriesNoFilterQuery.loading) || (this.props.allUserIndustriesQuery && this.props.allUserIndustriesQuery.loading))
                return (
                    <Industry
                        allUserIndustriesQuery={{allIndustries:[{id: '1', industry: 'Non Industry'}]}}
                        className='tc mb2 ml1 mt2'
                        industryId={0}
                        industry={'loading the rest...'}
                        addIndustry={(e)=>console.log('still loading...')}
                        removeIndustry={(e)=>console.log('still loading...')}/>
                )
            if ((this.props.allIndustriesNoFilterQuery && this.props.allIndustriesNoFilterQuery.error) || (this.props.allUserIndustriesQuery && this.props.allUserIndustriesQuery.loading))
                return (
                    <Industry
                        allUserIndustriesQuery={{allIndustries:[{id: '1', industry: 'Non Industry'}]}}
                        className='tc mb2 ml1 mt2'
                        industryId={0}
                        industry={'Error Fetching Industries'}
                        addIndustry={(e)=>console.log('error')}
                        removeIndustry={(e)=>console.log('error')}/>
                )
            if (this.props.allIndustriesNoFilterQuery.allIndustries){
                return this.props.allIndustriesNoFilterQuery.allIndustries.map(industry => (
                (!industry.default)?
                    <Industry
                        key={industry.id}
                        allUserIndustriesQuery={this.props.allUserIndustriesQuery}
                        className='tc mb2 ml1 mt2'
                        industryId={industry.id}
                        industry={industry.industry}
                        addIndustry={this._handleAddIndustry}
                        removeIndustry={this._handleRemoveIndustry}/>: null
            ))}
            return  (
                <Industry
                    allUserIndustriesQuery={{allIndustries:[{id: '1', industry: 'Non Industry'}]}}
                    className='tc mb2 ml1 mt2'
                    industryId={0}
                    industry={'Error Fetching Industries'}
                    addIndustry={(e)=>console.log('error')}
                    removeIndustry={(e)=>console.log('error')}/>
            )
        }
        return (
            <div className='w-80'>
                <h2 className=' tc mb2 mt2 dark-gray'>Industries</h2>
                <div className='flex justify-between flex-wrap'>
                    <GenericIndustry />
                    <IndustryArrayMap />
                </div>
            </div>
        )
    }
    _handleAddIndustry = async (industryId) => {
        const userId = localStorage.getItem(GC_USER_ID)
        await this.props.addIndustryMutation({
            variables: {
                industryId: industryId,
                userId: userId
            },
            update: (store, {data: {addToUserIndustries} }) => {
                const data = store.readQuery({query: ALL_INDUSTRIES_QUERY, variables: { id: userId }})
                data.allIndustries.push(Object.values(addToUserIndustries)[0])
                store.writeQuery({
                    query: ALL_INDUSTRIES_QUERY,
                    data,
                    variables: { id: userId }
                })
            }
        })
    }
    _handleRemoveIndustry =  (industryId) => {
        const userId = localStorage.getItem(GC_USER_ID)
        this.props.removeIndustryMutation({
            variables: {
                industryId: industryId,
                userId: userId
            },
            update: (store) => {
                const data = store.readQuery({query: ALL_INDUSTRIES_QUERY, variables: { id: userId }})
                const removedIndustryIndex = data.allIndustries.findIndex((industry) => (industry.id === industryId))
                data.allIndustries.splice(removedIndustryIndex, 1)
                store.writeQuery({
                    query: ALL_INDUSTRIES_QUERY,
                    data,
                    variables: { id: userId }})
            }
        })
    }
}
const ALL_INDUSTRIES_NO_FILTER_QUERY = gql`
  query AllIndustriesQuery {
    allIndustries (orderBy: default_DESC){
          id
          default
          industry
        }}`
const ADD_INDUSTRY_MUTATION = gql`
    mutation UpdateUserIndustries($industryId: ID!, $userId: ID!){
        addToUserIndustries(usersUserId: $userId, industriesIndustryId: $industryId){
            industriesIndustry {
                id
                industry
                default
                }
        }}`
const REMOVE_INDUSTRY_MUTATION = gql`
    mutation UpdateSocialPost($industryId: ID!, $userId: ID!){
        removeFromUserIndustries(usersUserId: $userId, industriesIndustryId: $industryId){
            industriesIndustry {
                id
                }
        }}`
export default compose(
    graphql(ALL_INDUSTRIES_QUERY, {
        name: 'allUserIndustriesQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
                variables: { id: userId }
            }}}),
    graphql(ALL_INDUSTRIES_NO_FILTER_QUERY, { name: 'allIndustriesNoFilterQuery'}),
    graphql(ADD_INDUSTRY_MUTATION, {name: 'addIndustryMutation'}),
    graphql(REMOVE_INDUSTRY_MUTATION, {name: 'removeIndustryMutation'})
)(IndustriesPage)
/*
 mutation {
   addToUserIndustries(
    usersUserId: "cj9thr98jcyyg01389w1npqfo",
    industriesIndustryId: "cj8vqi8ko00170195qdj3zuqh"){
            industriesIndustry {
                id
                industry
                }
        }}

        Response:
{
  "data": {
    "addToUserIndustries": {
      "industriesIndustry": {
        "id": "cj8vqi8ko00170195qdj3zuqh",
        "industry": "Automotive"
      }
    }
  }
}
 */