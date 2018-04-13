import React from 'react'
import { graphql, compose } from 'react-apollo'
import {ALL_SOCIAL_PROFILES_QUERY} from "../../../graphql/socialProfiles";
import {GC_USER_ID} from '../../../constants'
import {Consumer} from "../../../Context";
import LoadingIcon from '../../independent/LoadingIcon'
import ErrorIcon from '../../independent/ErrorIcon'

const SocialProfilesArray = (props) => {
    if (props.allSocialProfilesQuery && props.allSocialProfilesQuery.loading) {
        return <LoadingIcon/>
    }
    if (props.allSocialProfilesQuery && props.allSocialProfilesQuery.error) {
        return <ErrorIcon/>
    }
    return(
        <Consumer>{(state)=>{
            const { sp, setContext } = state
            return(
        <React.Fragment>
    {props.allSocialProfilesQuery.allSocialProfiles.map((socialProfile, index) =>
            (sp.site === socialProfile.site)?
                (sp.id === socialProfile.id)?
                    <div key={index} className='truncate seg-semibold pa2p mb3 flex justify-between fs23p smodin-black bw2p b--smodin-gray br4p bg-smodin-white'>
                        {socialProfile.name}
                        <i className='fa fa-cog' aria-hidden="true"/>
                    </div>
                    :<div key={index} className='pl3p mb3 flex justify-between fs23p smodin-black pointer'
                          onClick={()=>{setContext({sp: socialProfile})}}>
                        {socialProfile.name}
                        <i className='fa fa-cog h--smodin-white-p' aria-hidden="true"/>
                    </div>: null
        )}
        </React.Fragment>
        )}}</Consumer>
    )
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
)(SocialProfilesArray)