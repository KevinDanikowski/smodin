import React from 'react'
import {Consumer} from "../../../Context";


const profileMenuArray = [
    {tab: 'posts', display: 'Posts', icon: 'fa-pencil'},
    {tab: 'parameters', display: 'Parameters', icon: 'fa-commenting'},
    {tab: 'schedule', display: 'Schedule', icon: 'fa-calendar'},
    {tab: 'queue', display: 'Queue', icon: 'fa-tasks'}]
const PostAutonomyTabs = () => {
    return(
    <Consumer>{(state)=>{
        const { tab, setContext } = state
        return(
            <React.Fragment>
        {profileMenuArray.map((menuItem, index) => {
            let className = 'pr1 fa ' + menuItem.icon
            return (
                (tab === menuItem.tab)?
                    <div key={index} className='seg-semibold pa2p mb3 fs23p smodin-black bw2p b--smodin-gray br4p bg-smodin-white'>
                        <i className={className} aria-hidden="true"/>
                        {menuItem.display}
                    </div>
                    :<div key={index} className='pl3p mb3 fs23p smodin-black pointer'
                          onClick={()=>{setContext({tab: menuItem.tab})}}>
                        <i className={className} aria-hidden="true"/>
                        {menuItem.display}
                    </div>
                )
            })}
            </React.Fragment>
        )}}</Consumer>
    )
}

export default PostAutonomyTabs