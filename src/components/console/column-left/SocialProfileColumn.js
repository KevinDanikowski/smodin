import React, { Component } from 'react'
import { socialProfiles, profileIcons } from '../../../constants'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { Consumer} from "../../../Context"
//import {faCoffee} from '@fortawesome/fontawesome-free-solid'
import {faTwitterSquare, faFacebookSquare, faLinkedin} from '@fortawesome/fontawesome-free-brands'//used from import

/* component passes hard coded tab of what profile is selected */
class SocialProfilesMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showSideBar: false
        }
    }
    render() {
        const SocialProfileMenuMap = ({setContext, sp}) => {
            return socialProfiles.map((profile, index) => {
                const SPIcon = profileIcons.find(profileIcon=> profileIcon.profile === profile.profile)
                return (sp.site === profile.profile)? //profile = full name
                    <div key={index} className='sp-menu-col-1-box-active flex justify-center items-center '>
                            <FontAwesomeIcon className='sp-menu-col-1-box-icon' style={{color: SPIcon.color}} icon={SPIcon.icon} />
                    </div>
                    :<div key={index} className='sp-menu-col-1-box flex justify-center items-center'
                          onClick={()=>{setContext({sp: {...sp, site: profile.profile}})}}>
                            <FontAwesomeIcon className='sp-menu-col-1-box-icon' style={{color: SPIcon.color }} icon={SPIcon.icon} />
                    </div>

            })
        }

        return (
            <Consumer>{(state)=>{
                const { setContext, sp } = state
                return(
            <div className='sp-menu-col-1 flex flex-column justify-start pt3'>
                <SocialProfileMenuMap setContext={setContext} sp={sp}/>
            </div>
                )}}</Consumer>
        )
    }
}

export default SocialProfilesMenu