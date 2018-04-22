import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import {
    UPDATE_SOCIAL_PROFILE_MUTATION, ALL_SOCIAL_PROFILES_QUERY, DELETE_SOCIAL_PROFILE_MUTATION
} from "../../graphql/socialProfiles"
import {ALL_PARAMETERS_QUERY} from "../../graphql/parameters";
import {ALL_SOCIAL_POSTS_QUERY} from "../../graphql/socialPosts";
import {DELETE_POSTING_PLATFORM_MUTATION, UPDATE_POSTING_PLATFORM_MUTATION} from "../../graphql/postingPlatforms";
import {DELETE_MONTHLY_POST_SCHEDULE_MUTATION,
    DELETE_WEEKLY_POST_SCHEDULE_MUTATION
} from "../../graphql/schedules";
import {DELETE_PARAMETER_MUTATION} from "../../graphql/parameters";
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import LoadingIcon from '../independent/LoadingIcon'
import {GC_USER_ID} from "../../constants";
import {confirmAlert} from "react-confirm-alert";
import {client} from "../../index";

class SettingsPage extends Component {
    constructor(props){
        super(props)
        const pp = this.props.sp.postingPlatform
        this.state = {
            platform: pp.platform,
            chosenPlatform: 'IFTTT',
            iftttEventName: pp.iftttEventName,
            iftttKey: pp.iftttKey,
            zapierUrl: pp.zapierUrl,
            name: this.props.sp.name,
            nameChanged: false,
            zapierUrlChanged: false,
            iftttKeyChanged: false,
            iftttEventNameChanged: false
        }
    }
    componentWillReceiveProps(newProps){
        const sp = this.props.sp
        const pp = this.props.sp.postingPlatform
        const newPP = newProps.sp.postingPlatform
        if( sp.name !== newProps.sp.name) this.setState({name: newProps.sp.name})//updates if default input is left
        if( pp.iftttEventName !== newPP.iftttEventName) this.setState({iftttEventName: newPP.iftttEventName})
        if( pp.iftttKey !== newPP.iftttKey) this.setState({iftttKey: newPP.iftttKey})
        if( pp.zapierUrl !== newPP.zapierUrl) this.setState({zapierUrl: newPP.zapierUrl})
    }
    render(){
        const sp = this.props.sp
        return(
            <div className='settings-page single-page'>
                <h1>Profile Settings</h1>
                {(sp.id)?
                    <React.Fragment>
                        <div className='field'>
                            <TextField fullWidth={true}
                                       floatingLabelText="Name"
                                       value={this.state.name}
                                       onChange={(e) =>(e.target.value !== this.props.sp.name)?this.setState({name: e.target.value, nameChanged: true}):this.setState({name: e.target.value, nameChanged: false})}/>
                            {(this.state.nameChanged)?
                                <RaisedButton
                                    label="Update"
                                    fullWidth={false}
                                    onClick={this._updateName}/>
                                :null}
                        </div>
                        <div className='field flex justify-between'>
                            <TextField fullWidth={true}
                                       floatingLabelText="Industry"
                                       value={sp.industry.industry}
                                       disabled={true}/>
                        </div>
                        <div className='field flex justify-between'>
                            <TextField fullWidth={true}
                                       floatingLabelText="Site"
                                       value={sp.site}
                                       disabled={true}/>
                        </div>
                        <div className='platform-tabs'>
                            <Tabs value={this.state.platform}
                                  onChange={(val)=>this.setState({platform: val})}>
                                <Tab label='IFTTT' value='IFTTT'>
                                    <div className='platform-tabs-content'>
                                        <div className='flex justify-between items-center'>
                                            <span className='platform-tabs-field'>Key:</span>
                                            <TextField fullWidth={false}
                                                       floatingLabelText="Key"
                                                       value={this.state.iftttKey}
                                                       onChange={(e) =>(e.target.value !== this.props.sp.postingPlatform.iftttKey)?this.setState({iftttKey: e.target.value, iftttKeyChanged: true}):this.setState({iftttKey: e.target.value, iftttKeyChanged: false})}/>
                                        </div>
                                        {(this.state.iftttKeyChanged)?
                                            <RaisedButton label="Update"
                                                          fullWidth={false}
                                                          backgroundColor={'#673AB7'}
                                                          labelColor={'#ffffff'}
                                                          onClick={()=>{this._updatePostingPlatform({...sp.postingPlatform, iftttKey: this.state.iftttKey});this.setState({iftttKeyChanged: false})}}/>
                                            :null}
                                        <div className='flex justify-between items-center'>
                                            <span className='platform-tabs-field'>Event Name:</span>
                                            <TextField fullWidth={false}
                                                       floatingLabelText="Event Name"
                                                       value={this.state.iftttEventName}
                                                       onChange={(e) =>(e.target.value !== this.props.sp.postingPlatform.iftttEventName)?this.setState({iftttEventName: e.target.value, iftttEventNameChanged: true}):this.setState({iftttEventName: e.target.value, iftttEventNameChanged: false})}/>
                                        </div>
                                        {(this.state.iftttEventNameChanged)?
                                            <RaisedButton label="Update"
                                                          fullWidth={false}
                                                          style={{marginBottom: '20px'}}
                                                          backgroundColor={'#673AB7'}
                                                          labelColor={'#ffffff'}
                                                          onClick={()=>{this._updatePostingPlatform({...sp.postingPlatform, iftttEventName: this.state.iftttEventName});this.setState({iftttEventNameChanged: false})}}/>
                                            :null}
                                        {(sp.postingPlatform.platform !== 'IFTTT')?
                                            <RaisedButton label="Set to Post from IFTTT"
                                                          fullWidth={true}
                                                          backgroundColor={'#673AB7'}
                                                          labelColor={'#ffffff'}
                                                          onClick={()=>this._updatePostingPlatform({...sp.postingPlatform, platform: 'IFTTT'})}/>
                                            :null}
                                    </div>
                                </Tab>
                                <Tab label='Zapier' value='ZAPIER'>
                                    <div className='platform-tabs-content'>
                                        <div className='flex justify-between items-center'>
                                            <span className='platform-tabs-field'>Url:</span>
                                            <TextField fullWidth={false}
                                                       floatingLabelText="Key"
                                                       value={this.state.zapierUrl}
                                                       onChange={(e) =>(e.target.value !== this.props.sp.postingPlatform.zapierUrl)?this.setState({zapierUrl: e.target.value, zapierUrlChanged: true}):this.setState({zapierUrl: e.target.value, zapierUrlChanged: false})}/>
                                        </div>
                                        {(this.state.zapierUrlChanged)?
                                            <RaisedButton label="Update"
                                                          fullWidth={false}
                                                          style={{marginBottom: '20px'}}
                                                          backgroundColor={'#673AB7'}
                                                          labelColor={'#ffffff'}
                                                          onClick={()=>{this._updatePostingPlatform({...sp.postingPlatform, zapierUrl: this.state.zapierUrl});this.setState({zapierUrlChanged: false})}}/>
                                            :null}
                                        {(sp.postingPlatform.platform !== 'ZAPIER')?
                                            <RaisedButton label="Set to Post from Zapier"
                                                          fullWidth={true}
                                                          backgroundColor={'#673AB7'}
                                                          labelColor={'#ffffff'}
                                                          onClick={()=>this._updatePostingPlatform({...sp.postingPlatform, platform: 'ZAPIER'})}/>
                                            :null}
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>
                        <div className='delete-btn'>
                            <RaisedButton label="Delete Profile"
                                          fullWidth={false}
                                          backgroundColor={'#ff3d46'}
                                          labelColor={'#ffffff'}
                                          onClick={this._deleteSocialProfile}/>
                        </div>
                    </React.Fragment>
                    :<LoadingIcon/>
                }
            </div>
        )
    }
    _updatePostingPlatform = async (variables) => {
        await this.props.updatePostingPlatformMutation({
            variables: variables,
            update: (store, {data: {updatePostingPlatform}}) => {
                this.props.setContext({sp: {...this.props.sp, postingPlatform: updatePostingPlatform}})
            }
        })
    }
    _deleteSocialProfile = async () => {
        const sp = this.props.sp
        const spId = sp.id

        confirmAlert({
            title: `Are you sure?`,
            message: `${this.props.sp.name} will be deleted`,
            confirmLabel: 'Delete',
            cancelLabel: 'Cancel',
            onConfirm: async () => {
                deleteProfile()
                deleteWeeklySchedules()
                deleteMonthlySchedules()
                await deleteSocialPosts()
                await deleteParameters()
                await deletePostingPlatform()
                window.location.reload() //give error, not sure why
            }
        })
        const deleteWeeklySchedules = async () => {
            const schedules = sp.weeklySchedules
            if(schedules[0]) {
                schedules.forEach(async (schedule) => {
                    this.props.deleteWeeklyPostScheduleMutation({
                        variables: {
                            id: schedule.id
                        }
                    })
                })
            }
        }
        const deleteMonthlySchedules = async () => {
            const schedules = sp.monthlySchedules
            if (schedules[0]) {
                schedules.forEach(async (schedule) => {
                    this.props.deleteMonthlyPostScheduleMutation({
                        variables: {
                            id: schedule.id
                        }
                    })
                })
            }
        }
        const deleteParameters = async () => {
            const {allParameters} = await client.query({
                    query: ALL_PARAMETERS_QUERY,
                    variables: { socialProfileId: spId }
                }).then(({data: {allParameters}})=>{
                    return {allParameters}
                })
            return allParameters.forEach(async (parameter) => {
                this.props.deleteParameterMutation({
                    variables: {
                        id: parameter.id
                    }
                })
            })
        }
        const deleteSocialPosts = async () => {
            const {allSocialPosts} = await client.query({
                    query: ALL_SOCIAL_POSTS_QUERY,
                    variables: { socialProfileId: spId, searchText: '' }
                }).then(({data: {allSocialPosts}})=>{
                    return {allSocialPosts}
                })
            return allSocialPosts.forEach(async (socialPost) => {
                this.props.deleteSocialPostMutation({
                    variables: {
                        id: socialPost.id
                    }
                })
            })
        }
        const deletePostingPlatform = async () => {
            this.props.deletePostingPlatformMutation({
                variables: {id: sp.postingPlatform.id}
            })
        }
        const deleteProfile = async () => {
            const userId = localStorage.getItem(GC_USER_ID)
            return this.props.deleteSocialProfileMutation({
                variables: { id: spId },
                update: (store, {data: {deleteSocialProfile}}) => {
                    const data = store.readQuery({
                        query: ALL_SOCIAL_PROFILES_QUERY,
                        variables: {id: userId}
                    })
                    const deletedSPIndex = data.allSocialProfiles.indexOf(profile=>profile.id === spId)
                    data.allSocialProfiles.splice(deletedSPIndex, 1)
                    store.writeQuery({
                        query: ALL_SOCIAL_PROFILES_QUERY,
                        variables: {id: userId},
                        data
                    })
                }
            })
        }
    }
    _updateName = async () => {
        const spId = this.props.sp.id
        await this.props.updateSocialProfileMutation({
            variables: {
                id: spId,
                name: this.state.name
            },
            update: (store, {data: {updateSocialProfile}}) => {
                //update socialProfile query
                const userId = localStorage.getItem(GC_USER_ID)
                const data = store.readQuery({
                    query: ALL_SOCIAL_PROFILES_QUERY,
                    variables: {
                        id: userId
                    }
                })
                const socialProfileIndex = data.allSocialProfiles.findIndex(socialProfile => socialProfile.id === spId)
                data.allSocialProfiles.splice(socialProfileIndex, 1, updateSocialProfile)
                store.writeQuery({
                    query: ALL_SOCIAL_PROFILES_QUERY,
                    variables: {
                        id: userId
                    },
                    data
                })
                this.props.setContext({ sp: updateSocialProfile})
            }
        })
        this.setState({nameChanged: false})
    }
}

SettingsPage.propTypes = {
    sp: PropTypes.object.isRequired,
    setContext: PropTypes.func.isRequired
}
export default compose(
    graphql(DELETE_WEEKLY_POST_SCHEDULE_MUTATION, { name: 'deleteWeeklyPostScheduleMutation'}),
    graphql(DELETE_MONTHLY_POST_SCHEDULE_MUTATION, { name: 'deleteMonthlyPostScheduleMutation'}),
    graphql(DELETE_POSTING_PLATFORM_MUTATION, { name: 'deletePostingPlatformMutation'}),
    graphql(DELETE_SOCIAL_PROFILE_MUTATION, {name: 'deleteSocialProfileMutation'}),
    graphql(DELETE_SOCIAL_PROFILE_MUTATION, {name: 'deleteSocialProfileMutation'}),
    graphql(DELETE_PARAMETER_MUTATION, {name: 'deletedParameterMutation'}),
    graphql(UPDATE_SOCIAL_PROFILE_MUTATION, {name: 'updateSocialProfileMutation'}),
    graphql(UPDATE_POSTING_PLATFORM_MUTATION, {name: 'updatePostingPlatformMutation'})
)(SettingsPage)