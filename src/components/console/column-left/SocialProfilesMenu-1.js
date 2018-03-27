import React, { Component } from 'react'
import { socialProfiles } from '../../../constants'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
//import {faCoffee} from '@fortawesome/fontawesome-free-solid'
import {faTwitterSquare, faFacebookSquare, faLinkedin} from '@fortawesome/fontawesome-free-brands'

const profileIcons = [
    {profile: 'facebook', icon: faFacebookSquare, color: '#3b5998'},
    {profile: 'twitter', icon: faTwitterSquare, color: '#55acee'},
    {profile: 'linkedin', icon: faLinkedin, color: '#007bb5'}
]
/* component passes hard coded tab of what profile is selected */
class SocialProfilesMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showSideBar: false
        }
    }
    render() {
        const SocialProfileMenuMap = () => {
            return socialProfiles.map((profile, index) => {
                const SPIcon = profileIcons.find(profileIcon=> profileIcon.profile === profile.profile)
                return (this.props.socialProfile === profile.profile)? //profile = full name
                    <div key={index} className='sp-menu-col-1-box-active flex justify-center items-center '>
                            <FontAwesomeIcon className='sp-menu-col-1-box-icon' style={{color: SPIcon.color}} icon={SPIcon.icon} />
                    </div>
                    :<div key={index} className='sp-menu-col-1-box flex justify-center items-center'
                          onClick={()=>{this._passSocialProfileToParent(profile.profile)}}>
                            <FontAwesomeIcon className='sp-menu-col-1-box-icon' style={{color: SPIcon.color }} icon={SPIcon.icon} />
                    </div>

            })
        }

        return (
            <div className='sp-menu-col-1 flex flex-column justify-start pt3'>
                <SocialProfileMenuMap />
            </div>
        )
    }
    _passSocialProfileToParent = (socialProfile) => {
        this.props.receiveSocialProfile(socialProfile)
    }
}

export default SocialProfilesMenu