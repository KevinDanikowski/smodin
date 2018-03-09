import React, { Component } from 'react'
import { socialProfiles } from '../../../constants'
import './SocialProfilesMenu.css'

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
                return (this.props.socialProfile === profile.profile)?//profile is full name 'facebook' for example
                    <div key={index} className='h55p flex nowrap justify-start items-center background-gray'>
                        <div className='w4p h-100 bg-smodin-dark-blue' />
                        <div className='box40 bg-light-blue white ma5p'>
                            {profile.display}
                        </div>
                    </div>
                    :<div key={index} className='h55p flex nowrap justify-start items-center h--bg-smodin-background-gray-p'
                          onClick={()=>{this._passSocialProfileToParent(profile.profile)}}>
                        <div className='w4p h-100'/>
                        <div className='box40 bg-light-blue white ma5p' >
                        {profile.display}
                        </div>
                    </div>

            })
        }

        return (
            <div className='flex flex-column justify-start w55p bg-smodin-black overflow-hidden pt3'>
                <SocialProfileMenuMap />
            </div>
        )
    }
    _passSocialProfileToParent = (socialProfile) => {
        this.props.receiveSocialProfile(socialProfile)
    }
}

export default SocialProfilesMenu