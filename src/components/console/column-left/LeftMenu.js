import React, { Component } from 'react'
import SocialProfileColumn from './SocialProfilesMenu-1'
import ProfileMenu from './ProfileMenu-2.2'
import ProfileList from './ProfileList-2.1'

class LeftMenu extends Component {
    render(){
        console.log('sp', this.props.sp)
        return(
            <React.Fragment>
            {/*column 1*/}
                <SocialProfileColumn
                    socialProfile={this.props.site}
                    receiveSocialProfile={this._passSocialProfile}/>
                <div className='sp-menu-col-2 flex-1 flex flex-column overflow-y-scroll'>
                        <ProfileList
                            socialProfile={this.props.site}
                            selectedSocialProfileId={this.props.selectedSocialProfileId}
                            receiveSelectedSocialProfile={this._passSelectedSocialProfile}/>
                        <ProfileMenu
                            tab={this.props.tab}
                            receiveTab={this._passTab}/>
                </div>
            </React.Fragment>
        )
    }
    _passSocialProfile = (socialProfile) => {
        this.props.receiveSocialProfile(socialProfile)
    }
    _passTab = (tab) => {
        this.props.receiveTab(tab)
    }
    _passSelectedSocialProfile = (spId, spName, spSite, spPhotoUrl) => {
        this.props.receiveSelectedSocialProfile(spId, spName, spSite, spPhotoUrl)
    }
}
export default LeftMenu