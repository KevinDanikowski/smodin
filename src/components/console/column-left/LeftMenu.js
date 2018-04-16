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
                <span className='flex justify-between items-center'>
                    <h2>Profiles</h2>
                    <Link to='/create-profile' className='add-profile flex items-center'>
                        <i className="fa fa-plus" aria-hidden="true"/>
                    </Link>
                </span>
                <hr/>
                <SocialProfilesArray />
            </div>
            <div className='flex-column justify-start pt3 items-center pl2'>
                <h2>Tabs</h2>
                <hr/>
                <PostAutonomyTabs />
            </div>
        </div>
    </React.Fragment>

export default LeftMenu