import React, { Component } from 'react'
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import LoadingIcon from '../independent/LoadingIcon'

class SettingsPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            platform: this.props.sp.postingPlatform ?
                this.props.sp.postingPlatform.platform : 'IFTTT',
            chosenPlatform: 'IFTTT',
            iftttEventName: '',
            iftttKey: '',
            zapierUrl: '',
            name: this.props.sp.name,
            nameChanged: false
        }
    }
    componentWillReceiveProps(newProps){
        if( this.props.sp.name !== newProps.sp.name) this.setState({name: newProps.sp.name})//updates if default input is left
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
                                       onChange={(e) =>this.setState({name: e.target.value, nameChanged: true})}/>
                            {(this.state.nameChanged)?<RaisedButton label="Update"
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
                                                   onChange={(e) => this.setState({iftttKey: e.target.value})}/>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='platform-tabs-field'>Event Name:</span>
                                        <TextField fullWidth={false}
                                                   floatingLabelText="Event Name"
                                                   value={this.state.iftttKey}
                                                   onChange={(e) => this.setState({iftttKey: e.target.value})}/>
                                    </div>
                                    {(sp.postingPlatform && sp.postingPlatform.platform === 'IFTTT')?
                                        <RaisedButton label="Set to Post from IFTTT"
                                                      fullWidth={true}
                                                      backgroundColor={'#673AB7'}
                                                      labelColor={'white'}
                                                      onClick={this._setPostingPlatform}/>
                                        :null}
                                </div>
                            </Tab>
                            <Tab label='Zapier' value='ZAPIER'>
                                <div>url</div>
                                <div>Make chosen platform</div>
                            </Tab>
                        </Tabs>
                        </div>
                    </React.Fragment>
                    :<LoadingIcon/>
                }
            </div>
        )
    }
    _setPostingPlatform = () => {

    }
    _updateName = () => {

    }
}

export default SettingsPage