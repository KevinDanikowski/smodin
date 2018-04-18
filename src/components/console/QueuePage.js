import React, { Component } from 'react'
//import { graphql, gql, compose } from 'react-apollo'
import { GC_USER_ID, buildTimeFrames } from '../../constants'
import FullCalendar from './Calendar'
import Dropdown from 'react-dropdown'
import '../../scss/QueuePage.scss'

class QueuePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scheduleType: this.props.scheduleType,
            scheduleLengthDisplay: 'length'
        }
    }
    render() {
        const Ribbon = () => {
            const scheduleLengths = buildTimeFrames.map(timeFrame => {return timeFrame.display})

            return(
                <div className='c-ribbon'>
                    <div className='flex items-center justify-between'>
                        <div className='inline-flex'>
                            {(this.state.scheduleType === 'monthly')?
                                <div className='scheduletypebutton-chosen scheduletypebuttonleft fw6 pa2'>Monthly</div>
                                :<div className='scheduletypebutton scheduletypebuttonleft fw6 pa2'
                                      onClick={() => {this.setState({scheduleType:'monthly'})}}>Monthly</div>}
                            {(this.state.scheduleType === 'weekly')?
                                <div className='scheduletypebutton-chosen scheduletypebuttonright fw6 pa2 mr3'>Weekly</div>
                                :<div className='scheduletypebutton scheduletypebuttonright fw6 pa2 mr3'
                                      onClick={() => {this.setState({scheduleType: 'weekly'})}}>Weekly</div>}
                        </div>
                        <Dropdown
                                className='w100p ma2'
                                onChange={async (object)=> await this.setState({scheduleLengthDisplay: object.value})}
                                value={this.state.scheduleLengthDisplay}
                                options={scheduleLengths} />
                        <div className='w160p flex items-end'>
                            <div className='pa1 tc bg-green white ba br2 b--black-20'
                                 onClick={(e)=>console.log('need to generate schedule with ALERT')}>Generate {this.state.scheduleLengthDisplay} of Posts</div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className='h-100 flex flex-column  w-100'>
                <Ribbon />
                <div className='h-100 inline-flex overflow-x-hidden w-100'>
                    <div className='flex-1 pa1 overflow-y-scroll'>
                        <FullCalendar />
                    </div>
                </div>
            </div>
        )
    }
}
export default QueuePage