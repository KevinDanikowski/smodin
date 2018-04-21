import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import {UPDATE_SOCIAL_PROFILE_MUTATION, ALL_SOCIAL_PROFILES_QUERY} from "../../graphql/socialProfiles"
import {UPDATE_POSTING_PLATFORM_MUTATION} from "../../graphql/postingPlatforms";
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import LoadingIcon from '../independent/LoadingIcon'
import {GC_USER_ID} from "../../constants";

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
        console.log(sp.postingPlatform)
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
                                                      onClick={()=>this._updatePostingPlatform({...sp.postingPlatform, iftttKey: this.state.iftttKey},{ iftttKeyChanged: false})}/>
                                        :null}
                                    <div className='flex justify-between items-center'>
                                        <span className='platform-tabs-field'>Event Name:</span>
                                        <TextField fullWidth={false}
                                                   floatingLabelText="Event Name"
                                                   value={this.state.iftttEventName}
                                                   onChange={(e) => this.setState({iftttEventName: e.target.value})}/>
                                    </div>
                                    {(sp.postingPlatform && sp.postingPlatform.platform === 'IFTTT')?
                                        <RaisedButton label="Set to Post from IFTTT"
                                                      fullWidth={true}
                                                      backgroundColor={'#673AB7'}
                                                      labelColor={'#ffffff'}
                                                      onClick={this._setPostingPlatform}/>
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
                                                   onChange={(e) => this.setState({zapierUrl: e.target.value})}/>
                                    </div>
                                    {(sp.postingPlatform && sp.postingPlatform.platform === 'ZAPIER')?
                                        <RaisedButton label="Set to Post from Zapier"
                                                      fullWidth={true}
                                                      backgroundColor={'#673AB7'}
                                                      labelColor={'#ffffff'}
                                                      onClick={this._setPostingPlatform}/>
                                        :null}
                                </div>
                            </Tab>
                        </Tabs>
                        </div>
                    </React.Fragment>
                    :<LoadingIcon/>
                }
            </div>
        )
    }
    _updatePostingPlatform = async (variables) => {
        //todo finish this, left at this working but causes huge error
        const vars = {
            ...this.props.sp.postingPlatform,
            platform: '',//will put what this.props.sp.postingPlatform.platform is
            iftttKey: '',
            iftttEventName: '',
            zapierUrl: ''
        }
        console.log(variables)
        await this.props.updatePostingPlatformMutation({
            variables: variables,
            update: (store, {data: {updatePostingPlatform}}) => {
                this.props.setContext({sp: {postingPlatform: updatePostingPlatform}})
            }
        })
    }
    _setPostingPlatform = async (variables) => {

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
    graphql(UPDATE_SOCIAL_PROFILE_MUTATION, {name: 'updateSocialProfileMutation'}),
    graphql(UPDATE_POSTING_PLATFORM_MUTATION, {name: 'updatePostingPlatformMutation'})
)(SettingsPage)