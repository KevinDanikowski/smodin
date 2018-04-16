import React, { Component } from 'react'
import { USER_SETTINGS_QUERY } from '../../graphql/users'
import { ALL_SOCIAL_PROFILES_QUERY} from "../../graphql/socialProfiles"
import { graphql, compose } from 'react-apollo'
import { GC_USER_ID, sampleSocialProfile } from '../../constants'
import PropTypes from 'prop-types'
import ParameterList from './ParameterList'
import SocialPostList from './SocialPostList'
import SchedulePage from './SchedulePage'
import QueuePage from './QueuePage'
import SettingsPage from './SettingsPage'
import CreateSocialProfileLink from './CreateSocialProfileLink'
import LeftMenu from './column-left/LeftMenu'
import {Consumer} from "../../Context";

class Console extends Component {
    componentWillReceiveProps(nextProps) {
        //sets socialprofile on load
        if (this.props.sp.id === null && nextProps.allSocialProfilesQuery &&
            (!nextProps.allSocialProfilesQuery.loading && !nextProps.allSocialProfilesQuery.error)) {
            const firstSocialProfile = nextProps.allSocialProfilesQuery.allSocialProfiles[0]
            this.props.setContext({
                sp: (firstSocialProfile)? firstSocialProfile : sampleSocialProfile,
            })
        }
    }
    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        if (!userId) {
            return (
                <div>
                    <h1 className="tc">Oops! You are not logged in!</h1>
                    <button onClick={() => {
                        this.props.history.push('/login')
                    }}>Login
                    </button>
                </div>
            )
        }
        return (
            <Consumer>{(state)=>{
                const {
                    sp,
                    searchText,
                    tab,
                    scheduleType,
                    setContext
                } = state
                return(
            <div id='console' className='w-100 h-100 flex justify-start items-stretch-content-stretch'>
                <LeftMenu />
                {/*if no social profile*/}
                {(this.defaultSelectedSocialProfileId === '')?
                    <CreateSocialProfileLink />
                :<div className='flex-1 overflow-auto fill-area-col'>
                    <div className='flex-1 overflow-auto'>
                        {(tab === 'parameters')?
                        <ParameterList
                            selectedSocialProfileId={sp.id}
                            searchText={searchText}/> : null }
                        {(tab === 'posts')?
                        <SocialPostList
                            sp={sp}
                            setContext={setContext}
                            searchText={searchText}/> : null }
                        {(tab === 'schedule')?
                        <SchedulePage
                            spId={sp.id}
                            scheduleType={scheduleType}
                            allSocialProfilesQuery={this.props.allSocialProfilesQuery}/> : null }
                        {(tab === 'queue')?
                        <QueuePage
                            scheduleType={scheduleType}/> : null }
                        {(tab === 'settings')?
                        <SettingsPage sp={sp}/> : null }
                    </div>
                </div>}
            </div>
            )}}</Consumer>
        )
    }
}

Console.propTypes = {
    setContext: PropTypes.func.isRequired,
    sp: PropTypes.object.isRequired,
}

export default compose(
    graphql(USER_SETTINGS_QUERY,{
        name: 'userSettingsQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
                variables: { id: userId }
            }}}),
    graphql(ALL_SOCIAL_PROFILES_QUERY,{
        name: 'allSocialProfilesQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
                variables: { id: userId }
            }}})
)(Console)