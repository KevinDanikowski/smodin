import React, { Component } from 'react'
import { GC_USER_ID, socialProfiles } from './../../constants'
import { graphql, compose } from 'react-apollo'
import { client } from "../../index"
import Dropdown from 'react-dropdown'
import TextField from 'material-ui/TextField';
import { ALL_INDUSTRIES_QUERY} from "../../graphql/industries";
import {
    ALL_SOCIAL_PROFILES_QUERY,
    CREATE_SOCIAL_PROFILE_MUTATION,
    ALL_DEFAULT_PARAMETERS_QUERY,
    ALL_DEFAULT_SOCIAL_POSTS_QUERY, ADD_ALL_DEFAULT_PARAMETERS_ONE_BY_ONE_MUTATION,
    ADD_ALL_DEFAULT_SOCIAL_POSTS_ONE_BY_ONE_MUTATION
} from '../../graphql/socialProfiles'

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
            <React.Fragment>
                <h1>Create Profile</h1>
                <div className='flex flex-column'>
                    <div className='flex flex-column justify-center items-center'>
                        <TextField fullWidth={false}
                                   floatingLabelText="Name"
                                   value={this.state.name}
                                   onChange={(e) => this.setState({name: e.target.value})}/>
                        <Dropdown
                            className='w200p ma2'
                            onChange={async (object)=> await this.setState({site: object.value})}
                            value={this.state.site}
                            placeholder='site...' options={socialProfilesArray} />
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
            </React.Fragment>
        )
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
            },
            update: (store, {data: {createSocialProfile} }) => {
                const SPId = createSocialProfile.id

                //add all default parameters
                client.query({
                    query: ALL_DEFAULT_PARAMETERS_QUERY,
                    variables: { industryId: industryId }
                }).then(({data: {allDefaultParameters}})=>{
                    allDefaultParameters.map(defaultParameter => {
                        this.props.addAllDefaultParametersOneByOneMutation({
                            variables: {
                                socialProfileId: SPId,
                                default: true,
                                param: defaultParameter.param,
                                response: defaultParameter.response
                            }
                        })
                    })
                })

                //add all default social posts
                client.query({
                    query: ALL_DEFAULT_SOCIAL_POSTS_QUERY,
                    variables: { industryId: industryId }
                }).then(({data: {allDefaultSocialPosts}})=>{
                    allDefaultSocialPosts.map(defaultSocialPost => {
                        this.props.addAllDefaultSocialPostsOneByOneMutation({
                            variables: {
                                socialProfileId: SPId,
                                default: true,
                                message: defaultSocialPost.message
                            }
                        })
                    })
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

export default compose(
    graphql(ALL_INDUSTRIES_QUERY, {name: 'allIndustriesQuery'}),
    graphql(CREATE_SOCIAL_PROFILE_MUTATION, {name: 'createSocialProfileMutation'}),
    graphql(ADD_ALL_DEFAULT_PARAMETERS_ONE_BY_ONE_MUTATION, {name: 'addAllDefaultParametersOneByOneMutation'}),
    graphql(ADD_ALL_DEFAULT_SOCIAL_POSTS_ONE_BY_ONE_MUTATION, {name: 'addAllDefaultSocialPostsOneByOneMutation'}),
    graphql(ALL_SOCIAL_PROFILES_QUERY, {//todo change this when user query is source of social profiles
        name: 'allSocialProfilesQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
                variables: { id: userId }
            }}})
)(CreateSocialProfilePage)