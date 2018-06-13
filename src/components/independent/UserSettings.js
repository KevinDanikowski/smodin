import React, { Component } from 'react'
import { GC_USER_ID } from '../../constants'
import { graphql, compose } from 'react-apollo'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import LoadingIcon from '../independent/LoadingIcon'
import {USER_SETTINGS_QUERY,
    UPDATE_USER_NAME_MUTATION} from "../../graphql/users";

class UserSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            name: '',
            nameChanged: false,
            origionalName: ''
        }
    }
    componentWillReceiveProps(nextProps) {
        const query = nextProps.userSettingsQuery
        if (query && !query.loading && !query.error) {
            this.setState({name: query.User.name, origionalName: query.User.name, email: query.User.email})
        }
    }
    render(){
        const query = this.props.userSettingsQuery
        return (
            <React.Fragment>
                <h1>Settings</h1>
                {(query && !query.loading && !query.error) ?
                <React.Fragment>
                        <TextField fullWidth={true}
                            floatingLabelText="Name"
                            value={this.state.name}
                            onChange={(e) =>(e.target.value !== this.state.origionalName)?this.setState({name: e.target.value, nameChanged: true}):this.setState({name: e.target.value, nameChanged: false})}/>
                        {(this.state.nameChanged)?
                            <RaisedButton
                                label="Update"
                                fullWidth={false}
                                onClick={this._updateName}/>
                            :null}
                    <div className="ma3"><strong>Email: </strong>{this.props.userSettingsQuery.User.email} </div>
                </React.Fragment>
                : <LoadingIcon />}
            </React.Fragment>
        )
    }
    _updateName = async () => {
        const { name } = this.state
        let id = localStorage.getItem(GC_USER_ID)
        this.props.updateUserName({
            variables: {
                id: id,
                name: name
            }
        }).then(res => {
            this.setState({name: name, origionalName: name})
        })
    }
}

export default compose(
    graphql(USER_SETTINGS_QUERY, {
        name: 'userSettingsQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
            variables: { id: userId }
        }}}),
    graphql(UPDATE_USER_NAME_MUTATION, { name: 'updateUserName' })
)(UserSettings)