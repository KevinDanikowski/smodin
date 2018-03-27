import React, { Component } from 'react'
import { GC_USER_ID } from '../../constants'
import { graphql, compose } from 'react-apollo'
import {USER_SETTINGS_QUERY,
    UPDATE_USER_NAME_MUTATION} from "../../graphql/users";

class UserSettings extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            name: ''
        }
    }
    render(){
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
        if (this.props.userSettingsQuery && this.props.userSettingsQuery.loading) {
            return (
                <div>
                    <h1 className="tc">Settings</h1>
                    Loading...
                    <div>Name: Loading... </div>
                </div>
            )
        }
        if (this.props.userSettingsQuery && this.props.userSettingsQuery.error) {
            console.log(this.props.userSettingsQuery)
            console.log(userId)
            return (
                <div>
                    <h1 className="tc">Settings</h1>
                    Error
                    <div>Name: Error :(</div>
                </div>
            )
        }
        return (
            <div className='w-50'>
                <h1 className="tc">Settings</h1>
                <div className="flex ma3 justify-between items-center">
                    <div className=''><strong>Name: </strong> {this.props.userSettingsQuery.User.name}</div>
                    <div>
                        <input
                            className='ml3 pa1 br3 b--solid-ns b--black-40'
                            type='text'
                            placeholder='New Name...'
                            onChange={(e) => this.setState({ name: e.target.value })}
                            />
                        <button
                            className='ml3 mr3 bg-green b--dark-green br3 pr2 pl2 pb1 pt1 white-90 fw8'
                            onClick={ this._updateName }>update</button>
                    </div>
                </div>
                <div className="ma3"><strong>Email: </strong>{this.props.userSettingsQuery.User.email} </div>
            </div>
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