import React, { Component } from 'react'
import '../../scss/ConsoleRibbon.scss'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scheduleType: this.props.defaultScheduleType,
            buildView: this.props.defaultBuildView
        }
    }
    render() {
        return (
            <div className='flex items-center justify-end'>
                {(this.props.tab === 'schedule')?
                    <div className='inline-flex'>
                        <div className='self-center fw6 white mr3 '>
                            <span className='mr2'>Schedule</span>
                            <span>Type:</span>
                        </div>
                        {(this.state.scheduleType === 'monthly')?
                            <div className='scheduletypebutton-chosen scheduletypebuttonleft fw6 pa2'>Monthly</div>
                            :<div className='scheduletypebutton scheduletypebuttonleft fw6 pa2'
                                  onClick={() => {this._sendScheduleTypeToParent('monthly')}}>Monthly</div>}
                        {(this.state.scheduleType === 'weekly')?
                            <div className='scheduletypebutton-chosen scheduletypebuttonright fw6 pa2 mr3'>Weekly</div>
                            :<div className='scheduletypebutton scheduletypebuttonright fw6 pa2 mr3'
                                  onClick={() => {this._sendScheduleTypeToParent('weekly')}}>Weekly</div>}
                    </div>
                    : null }
                {(this.props.tab === 'queue')?
                    <div className='inline-flex'>
                        <div className='self-center fw6 white mr3 '>
                            <span className='mr2'>Build</span>
                            <span>View:</span>
                        </div>
                        {(this.state.buildView === 'calendar')?
                            <div className='scheduletypebutton-chosen scheduletypebuttonleft fw6 pa2'>Calendar</div>
                            :<div className='scheduletypebutton scheduletypebuttonleft fw6 pa2'
                                  onClick={() => {this._sendBuildViewToParent('calendar')}}>Calendar</div>}
                        {(this.state.buildView === 'list')?
                            <div className='scheduletypebutton-chosen scheduletypebuttonright fw6 pa2 mr3'>List</div>
                            :<div className='scheduletypebutton scheduletypebuttonright fw6 pa2 mr3'
                                  onClick={() => {this._sendBuildViewToParent('list')}}>List</div>}
                    </div>
                    : null }
            </div>
        )
    }
    _sendScheduleTypeToParent = async (scheduleType) => {
        await this.setState({ scheduleType: scheduleType })
        this.props.receiveScheduleType(scheduleType)
    }
    _sendBuildViewToParent = async (buildView) => {
        await this.setState({ buildView: buildView })
        this.props.receiveBuildView(buildView)
    }
}
export default Search
