import React, { Component } from 'react'
//import { graphql, gql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import {Tabs, Tab} from 'material-ui/Tabs'
import {scheduledPostClient} from "../../index"
import { buildTimeFrames, sampleEvents } from '../../constants'
import { ALL_SCHEDULED_POSTS_QUERY} from "../../graphql/socialPosts"
import Dropdown from 'react-dropdown'
import FullCalendar from 'fullcalendar-reactwrapper'
import 'fullcalendar/dist/fullcalendar.css';

class QueuePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scheduleLengthDisplay: 'length',
            events: sampleEvents
        }
    }
    componentDidMount() {
        //TODO set this up once microservice running
        // scheduledPostClient.query({
        //     query: ALL_SCHEDULED_POSTS_QUERY,
        //     variables: {socialProfileId: this.props.sp.id}
        // }).then(({data: {allScheduledPostsQuery}}) => {
        //     (allScheduledPostsQuery) ? this.setState({events: allScheduledPostsQuery.allScheduledPosts}):null
        // })
    }
    render() {
        const scheduleLengths = buildTimeFrames.map(timeFrame => {return timeFrame.display})
        return (
            <div id='queue-page' className='h-100 flex flex-column  w-100'>
                <div className='queue-header'>
                    <Tabs className='queue-tabs' value={this.props.scheduleType}
                          onChange={(val)=>this.props.setContext({scheduleType: val})}>
                        <Tab label='Monthly' value='MONTHLY'/>
                        <Tab label='Weekly' value='WEEKLY'/>
                    </Tabs>
                    <Dropdown
                        className='queue-dropdown'
                        onChange={async (object)=> await this.setState({scheduleLengthDisplay: object.value})}
                        value={this.state.scheduleLengthDisplay}
                        options={scheduleLengths} />
                    <button className='queue-button' onClick={(e)=>console.log('need to generate schedule with ALERT')}>Generate {this.state.scheduleLengthDisplay} of Posts</button>
                </div>
                <div className='h-100 inline-flex overflow-x-hidden w-100'>
                    <div className='flex-1 pa1 overflow-y-scroll'>
                        <FullCalendar
                            navLinks={true}
                            editable={false}
                            eventLimit={true}
                            events={this.state.events}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

QueuePage.propTypes = {
    sp: PropTypes.object.isRequired,
    scheduleType: PropTypes.string.isRequired
}
export default QueuePage