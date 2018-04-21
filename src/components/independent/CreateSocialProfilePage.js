import React, { Component } from 'react'
import { GC_USER_ID, socialProfiles } from './../../constants'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import { client } from "../../index"
import Dropdown from 'react-dropdown'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import LoadingIcon from '../independent/LoadingIcon'
import { ALL_INDUSTRIES_QUERY} from "../../graphql/industries";
import {CREATE_POSTING_PLATFORM_MUTATION} from "../../graphql/postingPlatforms";
import {
    ALL_SOCIAL_PROFILES_QUERY,
    CREATE_SOCIAL_PROFILE_MUTATION,
    ALL_DEFAULT_PARAMETERS_QUERY,
    ALL_DEFAULT_SOCIAL_POSTS_QUERY,
    ADD_ALL_DEFAULT_PARAMETERS_ONE_BY_ONE_MUTATION,
    ADD_ALL_DEFAULT_SOCIAL_POSTS_ONE_BY_ONE_MUTATION
} from '../../graphql/socialProfiles'

class CreateSocialProfilePage extends Component {
    constructor(props){
        super(props)
        this.state = {
            site: '',
            industryId: '',
            industry: '',
            name: '',
            loadingNewProfile: false
        }
    }
    render() {
        const socialProfilesArray = socialProfiles.map(socialProfile => {return socialProfile.profile})
        const industries = () => {
            if (this.props.allIndustriesQuery && this.props.allIndustriesQuery.loading) return [{id: '', industry: 'Loading...'}]
            if (this.props.allIndustriesQuery && this.props.allIndustriesQuery.error) return [{id: '', industry: 'ERR, try reloading'}]
            return this.props.allIndustriesQuery.allIndustries
        }
        const industriesList = industries().map(industry => {return industry.industry})
        return (
            <React.Fragment>
                {(!this.state.loadingNewProfile)? <h1>Create Profile</h1>: <h1>Setting Up {this.state.name}...</h1>}
                {(!this.state.loadingNewProfile)?
                <div className='flex flex-column justify-center items-center smodin-card pb3'>
                    <TextField fullWidth={false}
                               style={{minWidth: 200, width: 400}}
                               floatingLabelText="Profile Name"
                               value={this.state.name}
                               onChange={(e) => this.setState({name: e.target.value})}/>
                    <Dropdown
                        className='w200p ma2'
                        onChange={async (object)=> await this.setState({site: object.value})}
                        value={this.state.site}
                        placeholder='site...' options={socialProfilesArray} />
                    <Dropdown
                        className='w200p mb5 ma2'
                        onChange={(object)=> {this.setState({industry: object.value});this._setIndustryId(object.value)}}
                        value={this.state.industry}
                        placeholder='industry...' options={industriesList} />
                    <RaisedButton label="Create"
                          style={{minWidth: 200, width: 400}}
                          backgroundColor={'#673AB7'}
                          labelColor={'#ffffff'}
                          onClick={this._createSocialProfileMutation}/>
                </div>
                :<LoadingIcon />}
            </React.Fragment>
        )
    }

    _createSocialProfileMutation = async () => {//TODO need to add posting Profile creation!!
        this.setState({loadingNewProfile: true})
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
            update: async (store, {data: {createSocialProfile} }) => {
                this.props.setContext({sp: createSocialProfile, tab: 'settings'})
            }
        }).then(async( {data: {createSocialProfile} }) => {
            const {allDefaultParameters} = await client.query({
                query: ALL_DEFAULT_PARAMETERS_QUERY,
                variables: { industryId: industryId }
            }).then(({data: {allDefaultParameters}})=>{
                return {allDefaultParameters}
            })
            const {allDefaultSocialPosts} = await client.query({
                query: ALL_DEFAULT_SOCIAL_POSTS_QUERY,
                variables: { industryId: industryId }
            }).then(({data: {allDefaultSocialPosts}})=>{
                return {allDefaultSocialPosts}
            })

            //add parameters
            await allDefaultParameters.map(defaultParameter => {
                return this.props.addAllDefaultParametersOneByOneMutation({
                    variables: {
                        socialProfileId: createSocialProfile.id,
                        default: true,
                        param: defaultParameter.param,
                        response: defaultParameter.response
                    }
                })
            })
            //add posts
            await allDefaultSocialPosts.map(defaultSocialPost => {
                return this.props.addAllDefaultSocialPostsOneByOneMutation({
                    variables: {
                        socialProfileId: createSocialProfile.id,
                        default: true,
                        message: defaultSocialPost.message
                    }
                })
            })
            //add posting platform
            await this.props.createPostingPlatformMutation({
                variables: {socialProfileId: createSocialProfile.id},
                update: (store, {data: {createPostingPlatform}}) => {
                    //todo update socialprofile query
                    this.props.setContext({sp: {...this.props.sp, postingPlatform: createPostingPlatform}})
                }
            })

            this.setState({loadingNewProfile: false})
        })
        this.props.history.push('/console')
    }
    _setIndustryId = (industryIndustry) => {
        const industryId = this.props.allIndustriesQuery.allIndustries.find(industry => industry.industry === industryIndustry).id
        this.setState({industryId: industryId})
    }
}
CreateSocialProfilePage.propTypes = {
    sp: PropTypes.object.isRequired,
    setContext: PropTypes.func.isRequired
}
export default compose(
    graphql(ALL_INDUSTRIES_QUERY, {name: 'allIndustriesQuery'}),
    graphql(CREATE_SOCIAL_PROFILE_MUTATION, {name: 'createSocialProfileMutation'}),
    graphql(CREATE_POSTING_PLATFORM_MUTATION, {name: 'createPostingPlatformMutation'}),
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