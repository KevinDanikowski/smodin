import React, { Component } from 'react'
import { USER_SETTINGS_QUERY } from '../../graphql/users'
import { ALL_SOCIAL_PROFILES_QUERY} from "../../graphql/socialProfiles"
import { graphql, compose } from 'react-apollo'
import { GC_USER_ID, sampleSocialProfile } from '../../constants'
import ParameterList from './ParameterList'
import SocialPostList from './SocialPostList'
import SchedulePage from './SchedulePage'
import QueuePage from './QueuePage'
import CreateSocialProfileLink from './CreateSocialProfileLink'
import LeftMenu from './column-left/LeftMenu'

class Console extends Component {
    constructor(props) {
        super(props)
        const defaultSearchText = ''
        const defaultTab = 'schedule'
        const defaultScheduleType = 'monthly'
        const defaultBuildView = 'calendar'
        const defaultSite = 'facebook'
        const defaultColumnTwo = 'profilemenu'
        const defaultSelectedSocialProfileId = null
        const defaultSelectedSocialProfile = {id: null, site: 'facebook', name: 'Name...', industry: {id: null}}
        this.state = {
            searchText: defaultSearchText,
            tab: defaultTab,
            scheduleType: defaultScheduleType,
            buildView: defaultBuildView,
            selectedSocialProfile: defaultSelectedSocialProfile,
            selectedSocialProfileId: defaultSelectedSocialProfileId,
            site: defaultSite,
            columnTwo: defaultColumnTwo
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextState.searchText === !this.state.searchText) {}
        if (nextState.tab === !this.state.tab) {}
    }
    componentWillReceiveProps(nextProps) {
        //sets profile and id
        if (this.state.selectedSocialProfileId === null && nextProps.allSocialProfilesQuery &&
            (!nextProps.allSocialProfilesQuery.loading && !nextProps.allSocialProfilesQuery.error)) {
            const firstSocialProfile = nextProps.allSocialProfilesQuery.allSocialProfiles[0]
            this.setState({
                //todo doesn't work for guest or any profile with no first profiles
                selectedSocialProfileId: (firstSocialProfile)? firstSocialProfile.id : sampleSocialProfile.id,
                site: (firstSocialProfile)?firstSocialProfile.site : sampleSocialProfile.site,
                selectedSocialProfile: (firstSocialProfile)? firstSocialProfile : sampleSocialProfile
            })
            this.props.sendSPToParent(firstSocialProfile.id, firstSocialProfile.name, firstSocialProfile.site, null)
            //todo probably dont need this localStorages any more since pass info to App.js
            localStorage.setItem('sp_id', (firstSocialProfile)? firstSocialProfile.id : sampleSocialProfile.id)
            localStorage.setItem('sp_name', (firstSocialProfile)? firstSocialProfile.name : sampleSocialProfile.name)
            localStorage.setItem('sp_site', (firstSocialProfile)? firstSocialProfile.site : sampleSocialProfile.site)
        }
    }
    render() {
        return (
            <div className='w-100 h-100 flex justify-start items-stretch-content-stretch'>
                <LeftMenu
                    socialProfile={this.state.site}
                    receiveSocialProfile={this._passSocialProfile}
                    tab={this.state.tab}
                    site={this.state.site}
                    receiveTab={this._passTab}
                    columnTwo={this.state.columnTwo}
                    selectedSocialProfileId={this.state.selectedSocialProfileId}
                    receiveSelectedSocialProfile={this._passSelectedSocialProfile}
                    />
                {/*if no social profile*/}
                {(this.defaultSelectedSocialProfileId === '')?
                    <CreateSocialProfileLink />
                :<div className='flex-1 overflow-auto fill-area-col'>
                    <div className='flex-1 overflow-auto'>
                        {(this.state.tab === 'parameters')?
                        <ParameterList
                            selectedSocialProfileId={this.state.selectedSocialProfileId}
                            searchText={this.state.searchText}/> : null }
                        {(this.state.tab === 'posts')?
                        <SocialPostList
                            selectedSocialProfileId={this.state.selectedSocialProfileId}
                            socialProfileIndustryId={this.state.selectedSocialProfile.industry.id}
                            receiveSearchText={this._passSearch}
                            defaultSearchText={this.state.searchText}
                            searchText={this.state.searchText}/> : null }
                        {(this.state.tab === 'schedule')?
                        <SchedulePage
                            selectedSocialProfileId={this.state.selectedSocialProfileId}
                            scheduleType={this.state.scheduleType}
                            allSocialProfilesQuery={this.props.allSocialProfilesQuery}/> : null }
                        {(this.state.tab === 'queue')?
                        <QueuePage
                            selectedSocialProfileId={this.state.selectedSocialProfileId}
                            scheduleType={this.state.scheduleType}
                            buildView={this.state.buildView}/> : null }
                    </div>
                </div>}
            </div>
        )
    }
    _passSearch = (searchText) => {
        this.setState({ searchText: searchText })
    }
    _passTab = (tab) => {
        this.setState({ tab: tab })
    }
    _passSocialProfile = (socialProfile) => {
        this.setState({ site: socialProfile })
    }
    _passSelectedSocialProfile = (spId, spName, spSite, spPhotoUrl) => {
        this.props.sendSPToParent(spId, spName, spSite, spPhotoUrl)
        this.setState({ selectedSocialProfileId: spId })
    }
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