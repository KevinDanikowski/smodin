import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import {ALL_SOCIAL_PROFILES_QUERY} from "../../../graphql/socialProfiles";
import { Link } from 'react-router-dom'
import { GC_USER_ID } from '../../../constants'

class ProfileList extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        if (!userId){
            return(
                <div>
                    <h1 className="tc">Oops! You're not logged in!</h1>
                    <button onClick={() => {
                        this.props.history.push('/login')
                    }}>Login
                    </button>
                </div>
            )
        }
        const SocialProfilesArray = () => {
            if (this.props.allSocialProfilesQuery && this.props.allSocialProfilesQuery.loading) {
                return (
                    <div>loading</div>
                )
            }
            if (this.props.allSocialProfilesQuery && this.props.allSocialProfilesQuery.error) {
                return (
                    <div>error</div>
                )
            }
            return this.props.allSocialProfilesQuery.allSocialProfiles.map((socialProfile, index) => {
                return (
                    (this.props.socialProfile === socialProfile.site)?
                        (this.props.selectedSocialProfileId === socialProfile.id)?
                        <div key={index} className='truncate seg-semibold pa2p mb3 flex justify-between fs23p smodin-black bw2p b--smodin-gray br4p bg-smodin-white'>
                            {socialProfile.name}
                            <i className='fa fa-cog' aria-hidden="true"/>
                        </div>
                        :<div key={index} className='pl3p mb3 flex justify-between fs23p smodin-black pointer'
                              onClick={()=>{this._sendSelectedSocialProfileIdToParent(socialProfile.id)}}>
                                {socialProfile.name}
                                <i className='fa fa-cog h--smodin-white-p' aria-hidden="true"/>
                        </div>: null
                )
            })
        }
        return (
            <div className='flex-column justify-start pt3 items-center pl2 w-100'>
                <div className='seg-semibold fs25p mb3 smodin-black'>{this.props.socialProfile}</div>
                <SocialProfilesArray />
                <Link to='/create-profile' className='link h--smodin-white-p mt4 pl3p mb3 flex justify-between fs23p seg-regular smodin-black pointer'>
                    Add Profile
                    <i className="fa fa-plus" aria-hidden="true"/>
                </Link>
            </div>
        )
    }
    _sendSelectedSocialProfileIdToParent = (selectedSocialProfileId) => {
        this.props.receiveSelectedSocialProfileId(selectedSocialProfileId)
    }
}

export default compose(
    graphql(ALL_SOCIAL_PROFILES_QUERY, {
        name: 'allSocialProfilesQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
                variables: { id: userId }
            }}})
)(ProfileList)
