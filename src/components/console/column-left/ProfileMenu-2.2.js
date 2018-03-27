import React, { Component } from 'react'
import { GC_USER_ID } from '../../../constants'

class ProfileMenu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tab: this.props.tab
        }
    }
    render() {
        //check if logged in
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

        const profileMenuArray = [
            {tab: 'posts', display: 'Posts', icon: 'fa-pencil'},
            {tab: 'parameters', display: 'Parameters', icon: 'fa-commenting'},
            {tab: 'schedule', display: 'Schedule', icon: 'fa-calendar'},
            {tab: 'queue', display: 'Queue', icon: 'fa-tasks'}]
        const PostAutonomyTabs = () => {
            return profileMenuArray.map((menuItem, index) => {
                let className = 'pr1 fa ' + menuItem.icon
                return (
                    (this.props.tab === menuItem.tab)?
                    <div key={index} className='seg-semibold pa2p mb3 fs23p smodin-black bw2p b--smodin-gray br4p bg-smodin-white'>
                        <i className={className} aria-hidden="true"/>
                        {menuItem.display}
                    </div>
                    :<div key={index} className='pl3p mb3 fs23p smodin-black pointer'
                        onClick={()=>{this._sendTabToParent(menuItem.tab)}}>
                        <i className={className} aria-hidden="true"/>
                        {menuItem.display}
                    </div>
                )
            })
        }
        return (
            <div className='flex-column justify-start pt3 items-center pl2'>
                <div className='seg-semibold fs25p mb3 smodin-black'>Post Autonomy</div>
                <PostAutonomyTabs />
            </div>
        )
    }
    _sendTabToParent = (tab) => {
        this.props.receiveTab(tab)
    }
}
ProfileMenu.propTypes = {
    //tab: PropType.String,
}
export default ProfileMenu