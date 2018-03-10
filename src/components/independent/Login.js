import React, { Component } from 'react'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../../constants'
import { graphql, compose } from 'react-apollo'
import { SIGNIN_USER_MUTATION,
    CREATE_USER_MUTATION
} from "../../graphql/users";
import './Login.css'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: true,
            email: '',
            password: '',
            name: ''
        }
    }
    render() {
        return (
            <div className='flex justify-center items-center flex-column w-100'>
                <h4 className='mv2 mb3 w-100 tc f-5'>{this.state.login ? 'Login' : 'Sign Up'}</h4>
                <div className=''>
                    {!this.state.login &&
                    <input
                        className='login-inputs mb3'
                        value={this.state.name}
                        onChange={(e) => this.setState({ name: e.target.value })}
                        type='text'
                        placeholder='Your name'
                    />}
                    <br/>
                    <input
                        className='login-inputs mb3'
                        value={this.state.email}
                        onChange={(e) => this.setState({ email: e.target.value })}
                        type='text'
                        placeholder='Your email address'
                    />
                    <br />
                    <input
                        className='login-inputs'
                        value={this.state.password}
                        onChange={(e) => this.setState({ password: e.target.value })}
                        type='password'
                        placeholder='Choose a safe password'
                    />
                </div>
                <div className='flex mt3'>
                    <div
                        className='pointer mr2 button'
                        onClick={() => this._confirm()}
                    >
                        {this.state.login ? 'login' : 'create account' }
                    </div>
                    <div
                        className='pointer button'
                        onClick={() => this.setState({ login: !this.state.login })}
                    >
                        {this.state.login ? 'need to create an account?' : 'already have an account?'}
                    </div>
                </div>
                <div className='flex mt3'>
                    <div
                        className='pointer button'
                        onClick={async (e) => {await this.setState({email: 'guest@ota.ai', password: 'password'});this._confirm()}}
                    >
                        Login As Guest
                    </div>
                </div>
            </div>
        )
    }

    _confirm = async () => {
        const { name, email, password } = this.state
        if (this.state.login) {
            const result = await this.props.signinUserMutation({
                variables: {
                    email,
                    password
                }
            })
            const id = result.data.signinUser.user.id
            const token = result.data.signinUser.token
            this._saveUserData(id, token)
        } else {
            //create user
            const result = await this.props.createUserMutation({
                variables: {
                    name,
                    email,
                    password
                }
            })
            const id = result.data.signinUser.user.id
            const token = result.data.signinUser.token
            this._saveUserData(id, token)
        }
        this.props.history.push(`/`)
    }

    _saveUserData = (id, token) => {
        localStorage.setItem(GC_USER_ID, id)
        localStorage.setItem(GC_AUTH_TOKEN, token)
        localStorage.setItem('defaultSocialProfile', {id: '', site: 'facebook'})//todo may not need
    }

}

export default compose(
    graphql(CREATE_USER_MUTATION, { name: 'createUserMutation' }),
    graphql(SIGNIN_USER_MUTATION, { name: 'signinUserMutation' })
)(Login)