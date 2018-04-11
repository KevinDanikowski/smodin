import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {Consumer} from "../../Context"
import {withRouter} from 'react-router'
import {GC_USER_ID, GC_AUTH_TOKEN, sampleSocialProfile} from '../../constants'
import {USER_SETTINGS_QUERY} from "../../graphql/users"
import {graphql} from 'react-apollo'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import {profileIcons} from '../../constants'
import {faTwitterSquare, faFacebookSquare, faLinkedin} from '@fortawesome/fontawesome-free-brands'//used from import
import SmodinSVG from '../../images/smodin-logo.svg'
import '../../scss/components.scss'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

function handleClick() {
    window.location = '/login'
}

class Header extends Component {

    state = {
      reading: false,
    };

    handleChange = (event, reading) => {
        this.setState({reading: reading});
    };

    render() {
        const path = window.location.pathname;
        const userId = localStorage.getItem(GC_USER_ID);
        const titleStyle = {cursor: 'pointer'};
        const DefaultHeader = ({sp}) => {
            return (
                <AppBar title={<span style={titleStyle}>Smodin</span>}
                        onTitleClick={handleClick}
                        iconElementRight={this.state.reading ? <FlatButton label="login" href="/login"/> : <FlatButton label="tutorial" href="/tutorial"/>}
                />
            )
        }
        const ConsoleHeader = ({sp}) => {
            const SPIcon = profileIcons.find(profileIcon => profileIcon.profile === sp.spSite)
            const color = (SPIcon) ? SPIcon.color : '';
            const icon = (SPIcon) ? SPIcon.icon : '';

            const MenuElements = (props) => (
                <IconMenu
                    {...props}
                    iconButtonElement={
                        <IconButton><MoreVertIcon/></IconButton>
                    }
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                >
                    <MenuItem primaryText="Console"
                              onClick={() => window.location = '/console'}
                              className={`link${(path === '/console') ? '-active' : ' '}`}
                              leftIcon={<FontIcon className="material-icons">dashboard</FontIcon>}
                    />
                    <MenuItem primaryText="Settings"
                              onClick={() => window.location = '/settings'}
                              className={`link${(path === '/settings') ? '-active' : ' '}`}
                              leftIcon={<FontIcon className="material-icons">settings</FontIcon>}
                    />
                    <MenuItem primaryText="Tutorial"
                              onClick={() => window.location = '/tutorial'}
                              className={`link${(path === '/tutorial') ? '-active' : ' '}`}
                              leftIcon={<FontIcon className="material-icons">help_outline</FontIcon>}
                    />
                    <MenuItem primaryText="Log Out"
                              onClick={() => {
                                  localStorage.removeItem(GC_USER_ID)
                                  localStorage.removeItem(GC_AUTH_TOKEN)
                                  localStorage.setItem('headerPath', '')
                                  this.props.history.push(`/login`)
                              }}
                              leftIcon={<FontIcon className="material-icons">exit_to_app</FontIcon>}
                    />
                </IconMenu>
            );
            MenuElements.muiName = 'IconMenu';

            return (
                <div className='subheader flex justify-between w-100'>
                    <AppBar title={sp.spName}
                            iconElementRight={<MenuElements/>}
                    />

                    {/*<div className='flex justify-center items-center relative'>*/}
                        {/*<div className='sp-icon flex justify-center items-center'>*/}
                            {/*{(this.props.sp.spPhotoUrl) ?*/}
                                {/*<img src={this.props.sp.spPhotoUrl} alt={this.props.sp.spName}/> :*/}
                                {/*<span>{this.props.sp.spName.charAt(0)}</span>}*/}
                            {/*<FontAwesomeIcon className='sp-icon-site' style={{color: color}}*/}
                                             {/*icon={icon || faFacebookSquare}/>*/}
                        {/*</div>*/}
                        {/*<span className='sp-name i flex justify-center items-center'>*/}

                        {/*</span>*/}
                    {/*</div>*/}
                    {/*<div className='left-header flex items-center  mr2'>*/}
                        {/*<SmodinSVG className='ml3' width={50} height={50}/>*/}
                    {/*</div>*/}
                </div>
            )
        }
        return (
            <Consumer>{(state)=>{
                const { sp } = state
                return(
            <div className='h-100 w-100 nowrap flex items-center justify-center' id='header'>
                {(userId) ? <ConsoleHeader sp={sp}/> : <DefaultHeader sp={sp}/>}
            </div>
            )}}</Consumer>
        )
    }

}

export default withRouter(
    graphql(USER_SETTINGS_QUERY, {
            name: 'userSettingsQuery',
            skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
            options: (ownProps) => {
                const userId = localStorage.getItem(GC_USER_ID)
                return {
                    variables: {id: userId}
                }
            }
        }
    )(Header))