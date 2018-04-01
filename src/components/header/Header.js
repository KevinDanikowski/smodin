import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import {GC_USER_ID, GC_AUTH_TOKEN, sampleSocialProfile} from '../../constants'
import {USER_SETTINGS_QUERY} from "../../graphql/users"
import { graphql } from 'react-apollo'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {profileIcons} from '../../constants'
import {faTwitterSquare, faFacebookSquare, faLinkedin} from '@fortawesome/fontawesome-free-brands'//used from import
import SmodinSVG from '../../images/smodin-logo.svg'
import '../../scss/components.scss'

class Header extends Component {
    render() {
        const path = window.location.pathname
        const userId = localStorage.getItem(GC_USER_ID)
        const DefaultHeader = () => {
            return (
                <div className='subheader flex justify-between w-100'>
                    <div className='flex justify-center items-center'>
                        <span className='sp-name flex justify-center items-center'>
                            Smodin
                        </span>
                    </div>
                    <div className='flex items-center  mr2'>
                        <Link to='/login' className='ml1 no-underline white fs25p'>login</Link>
                        <div className='ml1 white'>|</div>
                        <Link to='/tutorial' className='ml1 no-underline white fs25p'>tutorial</Link>
                        <SmodinSVG className='ml3' width={50} height={50}/>
                    </div>
                </div>
            )
        }
        const ConsoleHeader = () => {
            const SPIcon = profileIcons.find(profileIcon=> profileIcon.profile === this.props.sp.spSite)
            const color = (SPIcon)?SPIcon.color: ''
            const icon = (SPIcon)?SPIcon.icon: ''
            return (
                <div className='subheader flex justify-between w-100'>
                    <div className='flex justify-center items-center relative'>
                        <div className='sp-icon flex justify-center items-center'>
                            {(this.props.sp.spPhotoUrl)?<img src={this.props.sp.spPhotoUrl} alt={this.props.sp.spName}/>:
                            <span>{this.props.sp.spName.charAt(0)}</span>}
                            <FontAwesomeIcon className='sp-icon-site' style={{color: color}} icon={icon || faFacebookSquare} />
                        </div>
                        <span className='sp-name i flex justify-center items-center'>
                            {this.props.sp.spName}
                        </span>
                    </div>
                    <div className='left-header flex items-center  mr2'>
                        <Link to='/console' className={`link${(path==='/console')?'-active':' '}`}>Console</Link>
                        <div>|</div>
                        <Link to='/settings' className={`link${(path==='/settings')?'-active':' '}`} >Settings</Link>
                        <div>|</div>
                        <div className='link' onClick={() => {
                            localStorage.removeItem(GC_USER_ID)
                            localStorage.removeItem(GC_AUTH_TOKEN)
                            localStorage.setItem('headerPath', '')
                            this.props.history.push(`/login`)
                        }}>logout</div>
                        <div>|</div>
                        <Link to='/tutorial' className={`link${(path==='/tutorial')?'-active':' '}`}>tutorial</Link>
                        <SmodinSVG className='ml3' width={50} height={50}/>
                    </div>
                </div>
            )
        }
        return (
            <div className='h-100 w-100 nowrap flex items-center justify-center' id='header'>
                {(userId)?<ConsoleHeader/>:<DefaultHeader/>}
            </div>
        )
    }

}

export default withRouter(
    graphql(USER_SETTINGS_QUERY,{
        name: 'userSettingsQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
                variables: { id: userId }
        }}}
)(Header))