import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Header from './header/Header'
import Login from './independent/Login'
import Console from './console/Console'
import UserSettings from './independent/UserSettings'
import TutorialPage from './independent/TutorialPage'
import CreateSocialProfilePage from './independent/CreateSocialProfilePage'
import { GC_USER_ID } from '../constants'

class App extends Component {
    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        return (
          <div className='flexbox-parent'>
            <div className='' >
                <Header />
            </div>
            <div className='flex-1 overflow-auto fill-area background-gray'>
              <Switch>
                  {(userId)?
                  <Route exact path='/' render={() => <Redirect to='/console' />} />
                  :<Route exact path='/' render={() => <Redirect to='/login' />} />}
                  <Route exact path='/login' component={Login} />
                  <Route exact path='/console' component={Console} />
                  <Route exact path='/settings' component={UserSettings} />
                  <Route exact path='/tutorial' component={TutorialPage} />
                  <Route exact path='/create-profile' render={(props)=><CreateSocialProfilePage {...props}/>} />
              </Switch>
            </div>
            <div className='flex bg-black-20 b--t-smodin-dark-purple justify-between overflow-y-hidden'>
                <div className='flex-1 inline-flex items-center justify-start'>
                    <img src={require('../images/LinkedIn-Logo.png')} alt='LI' height='20' />
                    <a href='https://www.linkedin.com/in/kevin-danikowski'
                       className='ml1 dark-gray hover-blue no-underline'>About Me</a>
                </div>
                <div className='flex-2 inline-flex items-center justify-center'>
                    <img src={require('../images/GitHub-Mark-32px.png')} alt='GitHub' height='20' />
                    <a href='https://github.com/KevinDanikowski/smodin-post-writer'
                       className='ml1 dark-gray hover-blue no-underline'>This Code</a>
                    <img src={require('../images/GitHub-Mark-32px.png')} alt='GitHub' height='20' className='ml4' />
                    <a href='https://github.com/KevinDanikowski'
                       className='ml1 dark-gray hover-blue no-underline'>My GitHub</a>
                </div>
                <div className='flex-1 flex items-center justify-end'>
                    <a href='http://ota.ai'
                       className='ml1 dark-gray hover-blue no-underline'>© OTA AI, Inc. 2017</a>
                </div>
            </div>
          </div>
        )
    }
}

export default App;
