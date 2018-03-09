import React, { Component } from 'react'
import { USER_SETTINGS_QUERY } from '../../graphql/users'
import { ALL_SOCIAL_PROFILES_QUERY} from "../../graphql/socialProfiles"
import { graphql, compose } from 'react-apollo'
import { GC_USER_ID } from '../../constants'
import ParameterList from './ParameterList'
import SocialPostList from './SocialPostList'
import SchedulePage from './SchedulePage'
import QueuePage from './QueuePage'
import ConsoleRibbon from './ConsoleRibbon'
import SocialProfileColumn from './column-left/SocialProfilesMenu-1'
import ProfileMenu from './column-left/ProfileMenu-2.2'
import ProfileList from './column-left/ProfileList-2.1'
import CreateSocialProfileLink from './CreateSocialProfileLink'
import './Console.css'

class Console extends Component {
    constructor(props) {
        super(props)
        const primaryIndustryId = 'cj97jd2670t6501027go4pm46'//todo make this meaningless
        const primaryIndustry = 'Generic'//todo make this meaningless
        const defaultSearchText = ''
        const defaultTab = 'schedule'
        const defaultScheduleType = 'monthly'
        const defaultBuildView = 'calendar'
        const defaultSite = ''
        const defaultColumnTwo = 'profilemenu'
        const defaultSocialProfile = 'facebook'
        const defaultSelectedSocialProfileId = null
        const defaultSelectedSocialProfile = {id: null, site: 'facebook', industry: {id: null}}
        this.state = {
            selectedIndustryId: primaryIndustryId,
            selectedIndustry: primaryIndustry,
            searchText: defaultSearchText,
            tab: defaultTab,
            scheduleType: defaultScheduleType,
            buildView: defaultBuildView,
            socialProfile: defaultSocialProfile,
            selectedSocialProfile: defaultSelectedSocialProfile,
            selectedSocialProfileId: defaultSelectedSocialProfileId,
            site: defaultSite,
            columnTwo: defaultColumnTwo
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextState.selectedIndustryId === !this.state.selectedIndustryId) {}
        if (nextState.searchText === !this.state.searchText) {}
        if (nextState.tab === !this.state.tab) {}
    }
    componentWillReceiveProps(nextProps) {
        //sets profile and id
        if (this.state.selectedSocialProfileId === null && nextProps.allSocialProfilesQuery &&
            (!nextProps.allSocialProfilesQuery.loading && !nextProps.allSocialProfilesQuery.error)) {
            this.setState({
                selectedSocialProfileId: nextProps.allSocialProfilesQuery.allSocialProfiles[0].id,
                socialProfile: nextProps.allSocialProfilesQuery.allSocialProfiles[0].site,
                selectedSocialProfile: nextProps.allSocialProfilesQuery.allSocialProfiles[0]
            })
        }
    }
    render() {
        return (
            <div className='w-100 h-100 flex justify-start items-stretch-content-stretch'>
                {/*column 1*/}
                <SocialProfileColumn
                    socialProfile={this.state.socialProfile}
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
                                socialProfile={this.state.socialProfile}
                                selectedSocialProfileId={this.state.selectedSocialProfileId}
                                receiveSelectedSocialProfileId={this._passSelectedSocialProfileId}/> : null}
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
                            selectedIndustry={this.state.selectedIndustry}
                            selectedIndustryId={this.state.selectedIndustryId}
                            selectedSocialProfileId={this.state.selectedSocialProfileId}
                            socialProfileIndustryId={this.state.selectedSocialProfile.industry.id}
                            receiveSearchText={this._passSearch}
                            defaultSearchText={this.state.searchText}
                            searchText={this.state.searchText}/> : null }
                        {(this.state.tab === 'schedule')?
                        <SchedulePage
                            selectedIndustry={this.state.selectedIndustry}
                            selectedIndustryId={this.state.selectedIndustryId}
                            selectedSocialProfileId={this.state.selectedSocialProfileId}
                            scheduleType={this.state.scheduleType}/> : null }
                        {(this.state.tab === 'queue')?
                        <QueuePage
                            selectedIndustry={this.state.selectedIndustry}
                            selectedIndustryId={this.state.selectedIndustryId}
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
        this.setState({ socialProfile: socialProfile })
    }
    _passSelectedSocialProfileId = (selectedSocialProfileId) => {
        this.setState({ selectedSocialProfileId: selectedSocialProfileId })
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