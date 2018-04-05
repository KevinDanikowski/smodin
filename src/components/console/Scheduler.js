import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import { hours, minutes } from '../../constants'
import _ from 'underscore'

class Scheduler extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hour: '',
            minute: ''
        }
    }
    componentWillUpdate(nextProps, nextState){
        if (nextProps === this.props) return false
    }
    render() {
        const UserPostTimes = () => {
            const weeklySchedules = this.props.weeklySchedules
            const sortedWeeklySchedules = _.sortBy((_.sortBy(weeklySchedules, 'minute')), 'hour')
            return sortedWeeklySchedules.map((time,index) => {
                return (
                    <div key={index} className=' h20p flex justify-center mt1'>
                        <span className='font-couriernew fw4 tc'>{time.hour}:{time.minute}</span>
                        <span className='ml3 fw6 red hover-white pointer'
                              onClick={() => {this._deleteWeeklyPostSchedule(time.id)}}>X</span>
                    </div>
                )
            })
        }
        const FullDropdown = () => {//
            return (
                <div className='sch-box-dropdown inline-flex justify-center items-center'>
                    <Dropdown
                        className='w50p mr2'
                        onChange={async (object)=> await this.setState({hour: object.value})}
                        value={this.state.hour}
                        placeholder='hr' options={hours} />
                    <Dropdown
                        fluid multiple selection
                        className='w50p ml2 mr2'
                        onChange={async (object)=> await this.setState({minute: object.value })}
                        value={this.state.minute}
                        placeholder='min' options={minutes} />
                    <div className='hover-green pointer ml2 flex items-center'
                        onClick={()=> {this._addWeeklyPostSchedule()}}>
                        <i className="fa fa-calendar-check-o fa-lg" aria-hidden="true"> </i>
                    </div>
                </div>
            )
        }
        return (
            <div className='sch-box weekly flex flex-column items-center'>
                <h3>{this.props.day}</h3>
                <FullDropdown />
                <UserPostTimes />
            </div>
        )
    }
    _deleteWeeklyPostSchedule = (id) => {
        this.props.deleteWeeklyPostSchedule(id)
    }
    _addWeeklyPostSchedule = async () => {
        const dayNumber = this.props.dayNumber
        const hour = this.state.hour
        const minute = this.state.minute
        await this.props.addWeeklyPostSchedule(dayNumber,hour,minute)
        this.setState({ hour: '', minute: ''})
    }
}
export default Scheduler
