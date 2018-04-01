import React, { Component } from 'react'
import Dropdown from 'react-dropdown'
import { monthlyDayPositions, dayArray, hours, minutes } from '../../constants'
import _ from 'underscore'
//import { createSocialPostScheduling, socialPostsArray } from '../../createSocialPostScheduling.utils'

class MonthlyDayPostScheduler extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dayPosition: '',
            day: '',
            hour: '',
            minute: ''
        }
    }
    componentWillUpdate(nextProps, nextState){
        if (nextProps === this.props) return false
    }
    render() {
        const UserPostTimes = () => {
            const monthlyDaySchedules = this.props.monthlyDateSchedules
            const sortedMonthlyDaySchedules = _.sortBy((_.sortBy((_.sortBy(monthlyDaySchedules, 'minute')), 'hour')), 'monthDay')
            const MonthlyDaySchedules = () => {
                return sortedMonthlyDaySchedules.map((date,index) => {
                    const firstMonthDayNumber = date.monthDay.substr(0,1)
                    const secondMonthDayNumber = date.monthDay.substr(1,2)
                    const position = monthlyDayPositions.map(dayPosition => {if (dayPosition.number === firstMonthDayNumber) return dayPosition.position; return ''})
                    const day = dayArray.map(day => {if (day.number === secondMonthDayNumber) return day.dayShort; return ''})
                    return (
                        <div key={index} className='h20p flex items-center justify-center mt1'>
                            <span className='font-couriernew fw4 tc'>{position} {day} at {date.hour}:{date.minute}</span>
                            <span className='ml3 fw6 red hover-white pointer'
                                  onClick={() => {this._deleteMonthlyDateSchedule(date.id)}}>X</span>
                        </div>
                    )
                })
            }
            return (
                <div className='flex flex-column flex-1 justify-center  overflow-y-auto'>
                    <MonthlyDaySchedules />
                </div>
            )
        }
        const FullDropdown = () => {
            const dayPositionsArray = monthlyDayPositions.map(dayPosition => {return dayPosition.position})
            const dayArrayDayShorts = dayArray.map(day => {return day.dayShort})
            return (
                <div className='self-center flex justify-center flex-wrap items-center ma1'>
                    <div className='flex inline-flex items-center'>
                        <Dropdown
                            className='w100p ma2'
                            onChange={async (object)=> await this.setState({dayPosition: object.value})}
                            value={this.state.dayPosition}
                            placeholder='the' options={dayPositionsArray} />
                        <Dropdown
                            className='w100p ma2'
                            onChange={async (object)=> await this.setState({day: object.value})}
                            value={this.state.day}
                            placeholder='day' options={dayArrayDayShorts} />
                        <div className=' fw6 mr2 ml2'>at</div>
                    </div>
                    <div className='flex inline-flex items-center'>
                        <Dropdown
                            className='w50p ma2'
                            onChange={async (object)=> await this.setState({hour: object.value})}
                            value={this.state.hour}
                            placeholder='hr' options={hours} />
                        <div className=' fw6 ml2'>:</div>
                        <Dropdown
                            fluid multiple selection
                            className='w50p ml1 mr2'
                            onChange={async (object)=> await this.setState({minute: object.value })}
                            value={this.state.minute}
                            placeholder='min' options={minutes} />
                        <div className='hover-green pointer w50p ml2 flex items-center'
                             onClick={()=> {this._addMonthlyDateSchedule()}}>
                            <i className="fa fa-calendar-check-o fa-2x ml1" aria-hidden="true"> </i>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className='flex flex-column w-80 bg-black-05 h-100 ba br2 b--black-20 mw275p'>
                <h3 className='tc bg-black-20 mt0 pt2 pb2 mb1'>Add By Day</h3>
                <FullDropdown />
                <UserPostTimes />
                {/* WHEN SCHEDULE WORKS USE THIS <div className='tc pointer bg-red white ba br2 b--black-20'
                     onClick={()=>{createSocialPostScheduling('monthly', 12, [], this.props.allPostSchedulesQuery.allPostSchedules[0].weeklySchedules, socialPostsArray)}}>Test Generation</div> */}
                <div className='tc pointer bg-green white ba br2 b--black-20'
                     onClick={()=>{this._generateRecommendedMonthlySchedule()}}>Generate Recommended Monthly Day Schedule</div>
            </div>
        )
    }
    _deleteMonthlyDateSchedule = (id) => {
        this.props.deleteMonthlyPostSchedule(id)
    }
    _addMonthlyDateSchedule = async () => {
        const firstMonthDayNumber = monthlyDayPositions.find(dayPosition =>(dayPosition.position === this.state.dayPosition)).number
        const secondMonthDayNumber = dayArray.find(day => (day.dayShort === this.state.day)).number
        const monthlyScheduleType = 'monthDay'
        const monthDate = ''
        const monthDay = firstMonthDayNumber.concat(secondMonthDayNumber)
        const hour = this.state.hour
        const minute = this.state.minute
        await this.props.addMonthlyPostSchedule(monthlyScheduleType, monthDate, monthDay, hour, minute)
        this.setState({ monthlyDate: '', hour: '', minute: ''})
    }
    _generateRecommendedMonthlySchedule = async () => {
        await this.props.generateRecommendedMonthlySchedule('monthDay')
        this.setState({ dayPosition: '', day: '', hour: '', minute: ''})
    }
}
export default MonthlyDayPostScheduler
