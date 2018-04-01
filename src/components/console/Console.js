import React, { Component } from 'react'
import { USER_SETTINGS_QUERY } from '../../graphql/users'
import { ALL_SOCIAL_PROFILES_QUERY} from "../../graphql/socialProfiles"
import { graphql, compose } from 'react-apollo'
import { GC_USER_ID, sampleSocialProfile } from '../../constants'
import ParameterList from './ParameterList'
import SocialPostList from './SocialPostList'
import SchedulePage from './SchedulePage'
import QueuePage from './QueuePage'
import ConsoleRibbon from './ConsoleRibbon'
import SocialProfileColumn from './column-left/SocialProfilesMenu-1'
import ProfileMenu from './column-left/ProfileMenu-2.2'
import ProfileList from './column-left/ProfileList-2.1'
import CreateSocialProfileLink from './CreateSocialProfileLink'

class Console extends Component {
    constructor(props) {
        super(props)
        const defaultSearchText = ''
        const defaultTab = 'schedule'
        const defaultScheduleType = 'weekly'
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
                {/*column 1*/}
                <SocialProfileColumn
                    socialProfile={this.state.site}
                    receiveSocialProfile={this._passSocialProfile}/>
                <div className='flex flex-column pb1 pr1'>
                    {/*column 2*/}
                    {/*column headers*/}
                    <div className='flex nowrap justify-center items-center'>
                        {(this.state.columnTwo === 'profilelist')?
                        <div className='secondmenutab-l w45pr tc pt1 pb1 bg-smodin-white fs23p seg-semibold'>Profiles</div>
                        :<div className='secondmenutab-l w45pr tc pt1 pb1 self-stretch h--bg-smodin-white-p'
                            onClick={()=>{this.setState({columnTwo: 'profilelist'})}}>Profiles</div>}
                        <div className='w2p self-stretch bg-smodin-gray'/>
                        {(this.state.columnTwo === 'profilemenu')?
                            <div className='secondmenutab-r w45pr tc pt1 pb1 bg-smodin-white fs23p seg-semibold'>Menu</div>
                            :<div className='secondmenutab-r w45pr tc pt1 pb1 self-stretch h--bg-smodin-white-p'
                                  onClick={()=>{this.setState({columnTwo: 'profilemenu'})}}>Menu</div>}
                    </div>
                    {/*column 2*/}
                    <div className='flex-1 pt1 pr1 pl1 w200p flex overflow-y-scroll'>
                        {(this.state.columnTwo) === 'profilelist'?
                            <ProfileList
                                socialProfile={this.state.site}
                                selectedSocialProfileId={this.state.selectedSocialProfileId}
                                receiveSelectedSocialProfile={this._passSelectedSocialProfile}/> : null}
                        {(this.state.columnTwo === 'profilemenu')?
                            <ProfileMenu
                                tab={this.state.tab}
                                receiveTab={this._passTab}/> : null}
                    </div>
                </div>
                {/*if no social profile*/}
                {(this.defaultSelectedSocialProfileId === '')?
                    <CreateSocialProfileLink />
                :<div className='flex-1 overflow-auto fill-area-col'>
                    {(this.state.tab === 'posts')? null:
                    <div className='console-ribbon-design pt1 pb1 mb1'>
                        <ConsoleRibbon
                            tab={this.state.tab}
                            defaultScheduleType={this.state.scheduleType}
                            defaultBuildView={this.state.buildView}
                            receiveTab={this._passTab}
                            receiveScheduleType={this._passScheduleType}
                            receiveBuildView={this._passBuildView}/>
                    </div>}
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
    _passScheduleType = (scheduleType) => {
        this.setState({ scheduleType: scheduleType })
    }
    _passBuildView = (buildView) => {
        this.setState({ buildView: buildView })
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