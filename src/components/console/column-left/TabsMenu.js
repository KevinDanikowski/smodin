import React from 'react'
import {Consumer} from "../../../Context";
import { tabsMenu } from "../../../constants";

const PostAutonomyTabs = () => {
    return(
    <Consumer>{(state)=>{
        const { tab, setContext } = state
        return(
            <React.Fragment>
        {tabsMenu.map((menuItem, index) => {
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