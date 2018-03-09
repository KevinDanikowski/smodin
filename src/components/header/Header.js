import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { GC_USER_ID, GC_AUTH_TOKEN } from '../../constants'
import {USER_SETTINGS_QUERY} from "../../graphql/users"
import { graphql } from 'react-apollo'
import './Header.css'

class Header extends Component {
    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        return (
            <div className='flex w-100 nowrap justify-between' id='horizontalheader'>
                <div className='flex items-center white '>
                    {this.props.userSettingsQuery && ( !this.props.userSettingsQuery.loading && !this.props.userSettingsQuery.error) ?
                        <div className=' seg-semibold mr1 f2 ml2'>Welcome {(this.props.userSettingsQuery.User)? this.props.userSettingsQuery.User.name: null}</div>
                    : <div className=' seg-semibold mr1 f2 ml2'>Welcome</div>}
                </div>
                <div className='flex items-center  mr2'>
                    {userId ?
                        <div className='flex items-center black'>
                            <Link to='/console' className='ml1 no-underline white fs25p'>Console</Link>
                            <div className='ml1 white'>|</div>
                            <Link to='/settings' className='ml1 no-underline white fs25p'>Settings</Link>
                            <div className='ml1 white'>|</div>
                        <div className='ml1 pointer white fs25p' onClick={() => {
                            localStorage.removeItem(GC_USER_ID)
                            localStorage.removeItem(GC_AUTH_TOKEN)
                            localStorage.setItem('headerPath', '')
                            this.props.history.push(`/login`)
                            }}>logout</div>
                        </div>
                        :
                        <Link to='/login' className='ml1 no-underline white fs25p'>login</Link>
                    }
                    <div className='ml1 white'>|</div>
                    <Link to='/tutorial' className='ml1 no-underline white fs25p'>tutorial</Link>
                </div>
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