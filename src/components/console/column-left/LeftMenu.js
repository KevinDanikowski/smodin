import React from 'react'
import { Link } from 'react-router-dom'
import SocialProfileColumn from './SocialProfileColumn'
import SocialProfilesArray from './SocialProfilesArray'
import PostAutonomyTabs from './ProfileMenu'

const LeftMenu = () =>
    <React.Fragment>
        <SocialProfileColumn />
        <div className='sp-menu-col-2 flex-1 flex flex-column overflow-y-scroll'>
            <div className='flex-column justify-start pt3 items-center pl2 w-100'>
                <h2>Profiles</h2>
                <SocialProfilesArray />
                <Link to='/create-profile' className='link h--smodin-white-p mt4 pl3p mb3 flex justify-between fs23p seg-regular smodin-black pointer'>
                    Add Profile
                    <i className="fa fa-plus" aria-hidden="true"/>
                </Link>
            </div>
            <div className='flex-column justify-start pt3 items-center pl2'>
                <h2>Tabs</h2>
                <PostAutonomyTabs />
            </div>
        </div>
    </React.Fragment>

export default LeftMenu