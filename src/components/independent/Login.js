import React, {Component} from 'react'
import {GC_USER_ID, GC_AUTH_TOKEN} from '../../constants'
import {graphql, compose} from 'react-apollo'
import {
    SIGNIN_USER_MUTATION,
    CREATE_USER_MUTATION
} from "../../graphql/users";
import './Login.css'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SmodinSVG from '../../images/smodin-logo.svg'

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login: true,
            email: '',
            password: '',
            name: '',
            displayErrorMessage: false
        }
    }

    render() {
        const createAccount = {
            paddingTop: 0,
            paddingBottom: 0,
            textAlign: 'center',
            color: '#9E9E9E',
            cursor: 'pointer'
        };

        const loginLogo = {
            borderRadius: '50%',
            width: '100px',
            height: '100px',
            overflow: 'hidden',
            margin: '0 auto'
        };

        return (
            <div className="flex justify-center items-center">
                <div style={{maxWidth: "360px"}}>
                    <Card>
                        <div style={loginLogo}
                             className="flex justify-center items-center">
                            <SmodinSVG className='' width={80} height={80}/>
                        </div>
                        <CardTitle title={this.state.login ? 'Login' : 'Sign Up'}
                                    style={{textAlign: 'center',
                                            padding: 0}}/>

                        {this.state.displayErrorMessage?<div className='smodin-red tc'>Wrong Username or Password</div>: null}

                        <CardText style={{paddingTop: 0}}>
                            {!this.state.login &&
                            <TextField fullWidth={true}
                                       floatingLabelText="Your Name"
                                       value={this.state.name}
                                       onChange={(e) => this.setState({name: e.target.value, displayErrorMessage: false})}/>
                            }
                            <TextField fullWidth={true}
                                       floatingLabelText="Your Email Address"
                                       value={this.state.email}
                                       onChange={(e) => this.setState({email: e.target.value, displayErrorMessage: false})}/>
                            <TextField fullWidth={true}
                                       floatingLabelText="Your Password"
                                       value={this.state.password}
                                       onChange={(e) => this.setState({password: e.target.value, displayErrorMessage: false})}/>
                        </CardText>
                        <CardActions>
                            <RaisedButton label={this.state.login ? 'Sign In' : 'Create Account'}
                                          onClick={() => this._confirm()}
                                          fullWidth={true}
                                          backgroundColor={'#673AB7'}
                                          labelColor={'white'}/>
                        </CardActions>
                        <CardText style={createAccount}
                                  onClick={() => this.setState({login: !this.state.login})}>
                            {this.state.login ? 'Need to create an account? Sign Up' : 'Already have an account? Log In'}
                        </CardText>
                    </Card>
                    <RaisedButton label="Login As Guest"
                                  onClick={async (e) => {
                                      await this.setState({email: 'guest@ota.ai', password: 'password'});
                                      this._confirm()
                                  }}
                                  style={{marginTop: '20px'}}
                                  fullWidth={true}/>
                </div>
            </div>
        )
    }

    _confirm = async () => {
        const {name, email, password} = this.state
        if (this.state.login) {
            await this.props.signinUserMutation({
                variables: {
                    email,
                    password
                }
            }).then(data=>{
                const id = data.data.signinUser.user.id
                const token = data.data.signinUser.token
                this._saveUserData(id, token)
                this.props.history.push(`/`)
            }).catch(mutationError =>
                this.setState({displayErrorMessage: true})
            )
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
            this.props.history.push(`/`)
        }
    }

    _saveUserData = (id, token) => {
        localStorage.setItem(GC_USER_ID, id)
        localStorage.setItem(GC_AUTH_TOKEN, token)
        localStorage.setItem('defaultSocialProfile', {id: '', site: 'facebook'})//todo may not need
    }

}

export default compose(
    graphql(CREATE_USER_MUTATION, {name: 'createUserMutation'}),
    graphql(SIGNIN_USER_MUTATION, {name: 'signinUserMutation'})
)(Login)