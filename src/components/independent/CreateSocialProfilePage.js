import React, { Component } from 'react'
import { GC_USER_ID, socialProfiles } from './../../constants'
import { graphql, gql, compose } from 'react-apollo'
import Dropdown from 'react-dropdown'
import { ALL_SOCIAL_PROFILES_QUERY } from '../console/column-left/ProfileList'


class CreateSocialProfilePage extends Component {
    constructor(props){
        super(props)
        this.state = {
            site: '',
            industryId: '',
            industry: '',
            name: ''
        }
    }
    render() {
        const socialProfilesArray = socialProfiles.map(socialProfile => {return socialProfile.profile})
        const industries = () => {
            if (this.props.allIndustriesQuery && this.props.allIndustriesQuery.loading) return [{id: '', industry: 'loading...'}]
            if (this.props.allIndustriesQuery && this.props.allIndustriesQuery.error) return [{id: '', industry: 'ERR'}]
            return this.props.allIndustriesQuery.allIndustries
        }
        const industriesList = industries().map(industry => {return industry.industry})
        return (
            <div className='w-60 flex flex-column justify-start '>
                <h1 className=' tc mb4 mt5 dark-gray'>Create Profile</h1>
                <div className='flex flex-column'>
                    <div className='flex justify-between '>
                        <div className='seg-regular fs20p smodin-black'>Name:</div>
                        <input
                            className='w200p ma2 br4p bw1p b--smodin-gray pa1'
                            onChange={(object)=> this.setState({name: object.target.value})}
                            placeholder='name...' />
                    </div>
                    <div className='flex justify-between '>
                        <div className='seg-regular fs20p smodin-black'>Site:</div>
                        <Dropdown
                            className='w200p ma2'
                            onChange={async (object)=> await this.setState({site: object.value})}
                            value={this.state.site}
                            placeholder='site...' options={socialProfilesArray} />
                    </div>
                    <div className='flex justify-between '>
                        <div className='seg-regular fs20p smodin-black'>Industry:</div>
                        <Dropdown
                            className='w200p ma2'
                            onChange={(object)=> {this.setState({industry: object.value});this._setIndustryId(object.value)}}
                            value={this.state.industry}
                            placeholder='industry...' options={industriesList} />
                    </div>
                    <div className='self-center w-50 tc seg-regular fs23p mt5 pa3 b--smodin-gray bg-smodin-white h--bg-smodin-red-p br4p bw2p'
                        onClick={()=> this._createSocialProfileMutation()}>
                        Create
                    </div>
                </div>
            </div>
        )
    }
    _thisIsFirstSocialProfile = () => {
        return (this.props.allSocialProfilesQuery.allSocialProfiles === [])
    }
    _createSocialProfileMutation = async () => {
        const userId = localStorage.getItem(GC_USER_ID)
        const site = this.state.site
        const industryId = this.state.industryId
        const name = this.state.name
        await this.props.createSocialProfileMutation({
            variables: {
                userId: userId,
                site: site,
                industryId: industryId,
                name: name
            }
        }).then(({data}) => {
            console.log(this._thisIsFirstSocialProfile())
            if (this._thisIsFirstSocialProfile()) {
                console.log(data.createSocialProfile.id)
                this.props.updateUsersMainSocialProfileMutation({
                    variables: {
                        userId: userId,
                        socialProfileId: data.createSocialProfile.id
                    }
                })
            }
        })
        this.props.history.push('/console')
    }
    _setIndustryId = (industryIndustry) => {
        const industryId = this.props.allIndustriesQuery.allIndustries.find(industry => industry.industry === industryIndustry).id
        this.setState({industryId: industryId})
    }
}
const ALL_INDUSTRIES_QUERY = gql`
  query AllIndustriesQuery {
    allIndustries {
          id
          default
          industry
        }}`
const UPDATE_USER_MUTATION = gql`
  mutation UpdateUserMutation ($userId: ID!, $socialProfileId: ID!) {
    updateUser(id: $userId, mainSocialProfileId: $socialProfileId) {
          id mainSocialProfile {id site}
        }}`
const CREATE_SOCIAL_PROFILE_MUTATION = gql`
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
export default compose(
    graphql(ALL_INDUSTRIES_QUERY, {name: 'allIndustriesQuery'}),
    graphql(CREATE_SOCIAL_PROFILE_MUTATION, {name: 'createSocialProfileMutation'}),
    graphql(UPDATE_USER_MUTATION, {name: 'updateUsersMainSocialProfileMutation'}),
    graphql(ALL_SOCIAL_PROFILES_QUERY, {
        name: 'allSocialProfilesQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
                variables: { id: userId }
            }}})
)(CreateSocialProfilePage)