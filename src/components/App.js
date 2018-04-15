import React, {Component} from 'react'
import {Switch, Route, Redirect, withRouter} from 'react-router-dom'
import Header from './header/Header'
import Login from './independent/Login'
import Console from './console/Console'
import UserSettings from './independent/UserSettings'
import TutorialPage from './independent/staticPages/TutorialPage'
import StaticAbout from './independent/staticPages/AboutPage'
import CreateSocialProfilePage from './independent/CreateSocialProfilePage'
import FontAwesome from 'react-fontawesome'
import {Consumer} from '../Context'
import {GC_USER_ID} from '../constants'
import '../scss/base/base.scss'
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import SPT from './independent/SinglePageTemplate'

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
        return (
            <Consumer>{(state)=>{
                const { setContext, sp } = state//todo don't know if need
                return(
            <div className='flexbox-parent'>
                <Header/>
                <div className='flex-1 overflow-auto fill-area background-gray'>
                    <Switch>
                        {(userId) ?
                            <Route exact path='/' render={() => <Redirect to='/console'/>}/>
                            : <Route exact path='/' render={() => <Redirect to='/login'/>}/>}
                        <Route exact path='/login' component={Login}/>
                        <Route exact path='/console'
                               render={(props) => <Console sp={sp} setContext={setContext} {...props}/>}/>
                        <Route exact path='/settings' render={(props) =>
                            <SPT><UserSettings {...props}/></SPT>}/>
                        <Route exact path='/create-profile' render={(props) =>
                            <SPT><CreateSocialProfilePage {...props}/></SPT>}/>
                        {/*static pages*/}
                        <Route exact path='/tutorial' render={(props) =>
                            <SPT><TutorialPage/></SPT>}/>
                        <Route exact path='/about' render={(props) =>
                            <SPT><StaticAbout {...props}/></SPT>}/>
                    </Switch>
                </div>
            </div>
            )}}</Consumer>
        )
    }
}

export default withRouter(App);