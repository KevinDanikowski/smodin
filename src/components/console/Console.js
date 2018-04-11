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
import CreateSocialProfileLink from './CreateSocialProfileLink'
import LeftMenu from './column-left/LeftMenu'
import {Consumer} from "../../Context";

ParameterList.propTypes = {
    setContext: PropTypes.func.isRequired,
    sp: PropTypes.object.isRequired,
}

class Console extends Component {
    constructor(props) {
        super(props)
        const defaultSearchText = ''
        const defaultTab = 'posts'
        const defaultScheduleType = 'monthly'
        const defaultSite = 'facebook'
        const defaultColumnTwo = 'profilemenu'
        const defaultSelectedSocialProfileId = null
        const defaultSelectedSocialProfile = {id: null, site: 'facebook', name: 'Name...', industry: {id: null}}
        this.state = {
            searchText: defaultSearchText,
            tab: defaultTab,
            scheduleType: defaultScheduleType,
            selectedSocialProfile: defaultSelectedSocialProfile,
            selectedSocialProfileId: defaultSelectedSocialProfileId,
            site: defaultSite,
            columnTwo: defaultColumnTwo
        }
    }
    componentWillReceiveProps(nextProps) {
        //sets profile and id
        if (this.props.sp.id === null && nextProps.allSocialProfilesQuery &&
            (!nextProps.allSocialProfilesQuery.loading && !nextProps.allSocialProfilesQuery.error)) {
            const firstSocialProfile = nextProps.allSocialProfilesQuery.allSocialProfiles[0]
            this.props.setContext({
                //todo doesn't work for guest or any profile with no first profiles
                sp: (firstSocialProfile)? firstSocialProfile : sampleSocialProfile,
                site: (firstSocialProfile)?firstSocialProfile.site : sampleSocialProfile.site,
            })
            //this.props.sendSPToParent(firstSocialProfile.id, firstSocialProfile.name, firstSocialProfile.site, null)
        }
    }
    render() {
        return (
            <Consumer>{(state)=>{
                const {
                    sp,
                    searchText,
                    tab,
                    scheduleType,
                    selectedSocialProfile,
                    selectedSocialProfileId,
                    site,
                    columnTwo,
                    setContext
                } = state
                return(
            <div className='w-100 h-100 flex justify-start items-stretch-content-stretch'>
                <LeftMenu
                    sp={sp}
                    socialProfile={site}
                    receiveSocialProfile={this._passSocialProfile}
                    tab={tab}
                    site={site}
                    receiveTab={this._passTab}
                    columnTwo={columnTwo}
                    selectedSocialProfileId={sp.id}
                    receiveSelectedSocialProfile={this._passSelectedSocialProfile}
                    />
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
                            selectedSocialProfileId={sp.id}
                            socialProfileIndustryId={(sp.industry)? sp.industry.id : null}
                            receiveSearchText={this._passSearch}
                            defaultSearchText={searchText}
                            searchText={searchText}/> : null }
                        {(tab === 'schedule')?
                        <SchedulePage
                            selectedSocialProfileId={sp.id}
                            scheduleType={scheduleType}
                            allSocialProfilesQuery={this.props.allSocialProfilesQuery}/> : null }
                        {(tab === 'queue')?
                        <QueuePage
                            selectedSocialProfileId={sp.id}
                            scheduleType={scheduleType}/> : null }
                    </div>
                </div>}
            </div>
            )}}</Consumer>
        )
    }
    _passSearch = (searchText) => {
        this.props.setContext({ searchText: searchText })
    }
    _passTab = (tab) => {
        this.props.setContext({ tab: tab })
    }
    _passSocialProfile = (socialProfile) => {
        this.props.setContext({ site: socialProfile })
    }
    _passSelectedSocialProfile = (spId, spName, spSite, spPhotoUrl) => {
        let sp = Object.assign({},this.props.sp)
        sp.id = spId
        sp.name = spName
        sp.site = spSite
        //todo left off changing all counsole and app, need to now change names in components to new setting
        this.props.setContext({sp: sp})
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