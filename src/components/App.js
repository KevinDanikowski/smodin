import React, {Component} from 'react'
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import Header from './header/Header'
import Login from './independent/Login'
import Console from './console/Console'
import UserSettings from './independent/UserSettings'
import TutorialPage from './independent/TutorialPage'
import CreateSocialProfilePage from './independent/CreateSocialProfilePage'
import FontAwesome from 'react-fontawesome'
import {Consumer} from '../Context'
import {GC_USER_ID} from '../constants'
import '../scss/base/base.scss'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sp: {
                spId: null,
                spName: 'Name...',
                spSite: null,
                spPhotoUrl: null
            }
        }
    }

    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        const Footer = () => {
            return (
                <Paper zDepth={1}>
                    <BottomNavigation>
                        <BottomNavigationItem
                            label="About Me"
                            icon={<FontAwesome name='linkedin-square' size='lg'/>}
                            onClick={() => window.open('https://www.linkedin.com/in/kevin-danikowski')}
                        />
                        <BottomNavigationItem
                            label="Source Code"
                            icon={<FontAwesome name='github-square' size='lg'/>}
                            onClick={() => window.open('https://github.com/KevinDanikowski/smodin')}
                        />
                        <BottomNavigationItem
                            label="My GiHub"
                            icon={<FontAwesome name='github-square' size='lg'/>}
                            onClick={() => window.open('https://github.com/KevinDanikowski')}
                        />
                        <BottomNavigationItem
                            label="Rights"
                            icon={<FontAwesome name='copyright' size='lg'/>}
                            onClick={() => window.open('http://ota.ai')}
                        />
                    </BottomNavigation>
                </Paper>
            )
        };
        return (
            <Consumer>{(state)=>{
                const { setContext, sp } = state//todo don't know if need
                return(
            <div className='flexbox-parent'>
                <div className=''>
                    <Header/>
                </div>
                <div className='flex-1 overflow-auto fill-area background-gray'>
                    <Switch>
                        {(userId) ?
                            <Route exact path='/' render={() => <Redirect to='/console'/>}/>
                            : <Route exact path='/' render={() => <Redirect to='/login'/>}/>}
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/console'
                               render={(props) => <Console sp={sp} setContext={setContext} {...props}/>}/>
                        <Route exact path='/settings' component={UserSettings}/>
                        <Route exact path='/tutorial' component={TutorialPage}/>
                        <Route exact path='/create-profile' render={(props) => <CreateSocialProfilePage {...props}/>}/>
                    </Switch>
                </div>
                <Footer/>
            </div>
            )}}</Consumer>
        )
    }
}

export default withRouter(App);