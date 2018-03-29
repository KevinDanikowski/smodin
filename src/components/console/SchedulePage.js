import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { GC_USER_ID, dayArray, defaultWeeklyPostSchedules, defaultMonthlyDatePostSchedules, defaultMonthlyDayPostSchedules } from '../../constants'
import {ADD_MONTHLY_POST_SCHEDULE_MUTATION,
    ADD_WEEKLY_POST_SCHEDULE_MUTATION,
    ALL_POST_SCHEDULES_QUERY,
    DELETE_MONTHLY_POST_SCHEDULE_MUTATION,
    DELETE_WEEKLY_POST_SCHEDULE_MUTATION} from "../../graphql/schedules";
import MonthlyDatePostScheduler from './MonthlyDatePostScheduler'
import MonthlyDayPostScheduler from './MonthlyDayPostScheduler'
import Scheduler from './Scheduler'
import PropTypes from 'prop-types'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

class SchedulePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scheduleType: this.props.scheduleType
        }
    }
    componentWillUpdate(nextProps, nextState){
        if (nextProps === this.props) return false
    }
    render() {
        const DayScheduleArrayTopRow = () => {
            if (this.props.allPostSchedulesQuery && this.props.allPostSchedulesQuery.loading) {
                const weeklySchedulesLoading = [{hour: '...', minute: '...'}]
                return dayArray.map((dayObject, index) => {
                    return (dayObject.number < '5')?
                        <div key={index} className='w25pr mw160p'>
                            <Scheduler day={dayObject.day}
                                       weeklySchedules={weeklySchedulesLoading}/>
                        </div> : null
                }
                )
            }
            if (this.props.allPostSchedulesQuery && this.props.allPostSchedulesQuery.error) {
                const weeklySchedulesLoading = [{hour: 'ERR', minute: 'ERR'}]
                return dayArray.map((dayObject, index) => {
                    return (dayObject.number < '5')?
                        <div key={index} className='w25pr mw160p'>
                            <Scheduler day={dayObject.day}
                                       weeklySchedules={weeklySchedulesLoading}/>
                        </div> : null
                }
                )
            }
            return dayArray.map((dayObject, index) => {
                const schedules = this.props.allPostSchedulesQuery.allPostSchedules[0]
                const weeklySchedules = (schedules)? schedules.weeklySchedules.filter((schedule)=> {return schedule.day === dayObject.number}) : []
                return (dayObject.number < '5')?
                    <div key={index} className='w25pr mw160p'>
                        <Scheduler day={dayObject.day}
                            dayNumber={dayObject.number}
                            weeklySchedules={weeklySchedules}
                            deleteWeeklyPostSchedule={this._handleDeleteWeeklyPostSchedule}
                            addWeeklyPostSchedule={this._handleAddWeeklyPostSchedule}/>
                    </div> : null
                }
            )
        }
        const DayScheduleArrayBottomRow = () => {
            if (this.props.allPostSchedulesQuery && this.props.allPostSchedulesQuery.loading) {
                const weeklySchedulesLoading = [{hour: '...', minute: '...'}]
                return dayArray.map((dayObject, index) => {
                        return (dayObject.number > '4')?
                            <div key={index} className='w25pr mw160p'>
                                <Scheduler day={dayObject.day}
                                           weeklySchedules={weeklySchedulesLoading}/>
                            </div> : null
                    }
                )
            }
            if (this.props.allPostSchedulesQuery && this.props.allPostSchedulesQuery.error) {
                const weeklySchedulesLoading = [{hour: 'ERR', minute: 'ERR'}]
                return dayArray.map((dayObject, index) => {
                        return (dayObject.number > '4')?
                            <div key={index} className='w25pr'>
                                <Scheduler day={dayObject.day}
                                           weeklySchedules={weeklySchedulesLoading}/>
                            </div> : null
                    }
                )
            }
            return dayArray.map((dayObject, index) => {
                const schedules = this.props.allPostSchedulesQuery.allPostSchedules[0]
                const weeklySchedules = (schedules) ? schedules.weeklySchedules.filter((schedule)=> {return schedule.day === dayObject.number}) : []
                    return (dayObject.number > '4')?
                        <div key={index} className='w25pr mw160p'>
                            <Scheduler day={dayObject.day}
                                       dayNumber={dayObject.number}
                                       weeklySchedules={weeklySchedules}
                                       deleteWeeklyPostSchedule={this._handleDeleteWeeklyPostSchedule}
                                       addWeeklyPostSchedule={this._handleAddWeeklyPostSchedule}/>
                        </div> : null
                }
            )
        }
        const WeeklyScheduleType = () => {
            return(
                <div className='flex flex-column h-100'>
                    <div className='h-50 flex no-wrap justify-start'>
                        <DayScheduleArrayTopRow />
                    </div>
                    <div className='h-50 flex no-wrap justify-start'>
                        <DayScheduleArrayBottomRow />
                        <div className='w25pr flex'>
                            <div className=' w160p h-100 flex items-center'>
                                <div className='tc pointer bg-green white ba br2 b--black-20'
                                     onClick={()=>{this._handleGenerateRecommendedWeeklySchedule()}}>Generate Recommended Schedule</div>
                            </div>
                        </div>
                    </div>
                </div>
            )

        }
        const MonthlyScheduleType = () => {
            const monthlyDateSchedules = () => {
                if (this.props.allPostSchedulesQuery && this.props.allPostSchedulesQuery.loading) {
                    return [{monthDate: '...', hour: '...', minute: '...'}]
                }
                if (this.props.allPostSchedulesQuery && this.props.allPostSchedulesQuery.error) {
                    return [{monthDate: 'ERR', hour: 'ERR', minute: 'ERR'}]
                }
                if (this.props.allPostSchedulesQuery && this.props.allPostSchedulesQuery.allPostSchedules.length > 0) return this.props.allPostSchedulesQuery.allPostSchedules[0].monthlySchedules.filter((schedule) => {
                    return schedule.monthlyScheduleType === 'monthDate'})
                else return [{monthDate: '...', hour: '...', minute: '...'}]
            }
            const monthlyDaySchedules = () => {
                if (this.props.allPostSchedulesQuery && this.props.allPostSchedulesQuery.loading) {
                    return [{monthDay: '...', hour: '...', minute: '...'}]
                }
                if (this.props.allPostSchedulesQuery && this.props.allPostSchedulesQuery.error) {
                    return [{monthDay: 'ERR', hour: 'ERR', minute: 'ERR'}]
                }
                if (this.props.allPostSchedulesQuery && this.props.allPostSchedulesQuery.allPostSchedules.length > 0) return this.props.allPostSchedulesQuery.allPostSchedules[0].monthlySchedules.filter((schedule) => {
                    return schedule.monthlyScheduleType === 'monthDay'})
                else return [{monthDay: '...', hour: '...', minute: '...'}]
            }
            return (
                <div className='flex h-100 w-100'>
                    <div className='flex justify-center ma2 w-50 mw220p'>
                        <MonthlyDatePostScheduler
                            deleteMonthlyPostSchedule={this._handleDeleteMonthlyPostSchedule}
                            addMonthlyPostSchedule={this._handleAddMonthlyPostSchedule}
                            generateRecommendedMonthlySchedule={this._handleGenerateRecommendedMonthlySchedule}
                            monthlyDateSchedules={monthlyDateSchedules()}
                            allPostSchedulesQuery={this.props.allPostSchedulesQuery}/>
                    </div>
                    <div className='flex justify-center ma2 w-50 mw275p'>
                        <MonthlyDayPostScheduler
                            deleteMonthlyPostSchedule={this._handleDeleteMonthlyPostSchedule}
                            addMonthlyPostSchedule={this._handleAddMonthlyPostSchedule}
                            generateRecommendedMonthlySchedule={this._handleGenerateRecommendedMonthlySchedule}
                            monthlyDateSchedules={monthlyDaySchedules()}
                            allPostSchedulesQuery={this.props.allPostSchedulesQuery}/>
                    </div>
                </div>
            )
        }
        return (
            <div className='h-100 overflow-x-hidden'>
                {(this.props.scheduleType === 'weekly')?
                    <WeeklyScheduleType />: null}
                {(this.props.scheduleType === 'monthly')?
                    <MonthlyScheduleType />: null}
            </div>
        )
    }
    _handleDeleteWeeklyPostSchedule = (id) => {
        this.props.deleteWeeklyPostScheduleMutation({
            variables: {
                id: id
            },
            update: (store) => {
                const SPId = this.props.selectedSocialProfileId
                const data = store.readQuery({query: ALL_POST_SCHEDULES_QUERY, variables: {
                    socialProfileId: SPId
                }})
                const deletedWeeklyPostScheduleIndex = data.allPostSchedules[0].weeklySchedules.findIndex((weeklyPostSchedule) => (weeklyPostSchedule.id === id))
                data.allPostSchedules[0].weeklySchedules.splice(deletedWeeklyPostScheduleIndex, 1)
                store.writeQuery({query: ALL_POST_SCHEDULES_QUERY, data, variables: {
                    socialProfileId: SPId
                }})
            }
        })
    }
    _handleDeleteMonthlyPostSchedule = (id) => {
        this.props.deleteMonthlyPostScheduleMutation({
            variables: {
                id: id
            },
            update: (store) => {
                const SPId = this.props.selectedSocialProfileId
                const data = store.readQuery({query: ALL_POST_SCHEDULES_QUERY, variables: {
                    socialProfileId: SPId
                }})
                const deletedMonthlyPostScheduleIndex = data.allPostSchedules[0].monthlySchedules.findIndex((monthlyPostSchedule) => (monthlyPostSchedule.id === id))
                data.allPostSchedules[0].monthlySchedules.splice(deletedMonthlyPostScheduleIndex, 1)
                store.writeQuery({query: ALL_POST_SCHEDULES_QUERY, data, variables: {
                    socialProfileId: SPId
                }})
            }
        })
    }
    _handleAddWeeklyPostSchedule = async (day, hour, minute) => {
        const postScheduleId = this.props.allPostSchedulesQuery.allPostSchedules[0].id
        await this.props.addWeeklyPostScheduleMutation({
            variables: {
                day: day,
                hour: hour,
                minute: minute,
                postScheduleId: postScheduleId
            },
            update: (store, {data: {createWeeklyPostSchedule} }) => {
                const SPId = this.props.selectedSocialProfileId
                const data = store.readQuery({
                    query: ALL_POST_SCHEDULES_QUERY,
                    variables: {
                        socialProfileId: SPId
                    }
                })
                data.allPostSchedules[0].weeklySchedules.push(createWeeklyPostSchedule)
                store.writeQuery({
                    query: ALL_POST_SCHEDULES_QUERY,
                    data,
                    variables: {
                        socialProfileId: SPId
                    }
                })
            }
        })
    }
    _handleAddMonthlyPostSchedule = async (monthlyScheduleType, monthDate, monthDay, hour, minute) => {
        const postScheduleId = this.props.allPostSchedulesQuery.allPostSchedules[0].id
        await this.props.addMonthlyPostScheduleMutation({
            variables: {
                monthlyScheduleType: monthlyScheduleType,
                monthDate: monthDate,
                monthDay: monthDay,
                hour: hour,
                minute: minute,
                postScheduleId: postScheduleId
            },
            update: (store, {data: {createMonthlyPostSchedule} }) => {
                const SPId = this.props.selectedSocialProfileId
                const data = store.readQuery({
                    query: ALL_POST_SCHEDULES_QUERY,
                    variables: {
                        socialProfileId: SPId
                    }
                })
                data.allPostSchedules[0].monthlySchedules.push(createMonthlyPostSchedule)
                store.writeQuery({
                    query: ALL_POST_SCHEDULES_QUERY,
                    data,
                    variables: {
                        socialProfileId: SPId
                    }
                })
            }
        })
    }
    _handleGenerateRecommendedWeeklySchedule = async () => {
        confirmAlert({
            title: 'Are you sure?',
            message: 'All your weekly schedules will be deleted',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: () => {
                deleteExistingWeeklySchedules()
                addRecommendedWeeklySchedules()
            }
        })
        const deleteExistingWeeklySchedules = async () => {
            const firstPostSchedule = this.props.allPostSchedulesQuery.allPostSchedules[0]
            if(firstPostSchedule) {
                this.props.allPostSchedulesQuery.allPostSchedules[0].weeklySchedules.map(async (schedule) => {
                    this._handleDeleteWeeklyPostSchedule(schedule.id)
                })
            }
        }
        const addRecommendedWeeklySchedules = async () => {
            defaultWeeklyPostSchedules.map(async (schedule) => {
                this._handleAddWeeklyPostSchedule(schedule.day, schedule.hour, schedule.minute)
            })
        }
    }
    _handleGenerateRecommendedMonthlySchedule = async (monthlyScheduleType) => {
        confirmAlert({
            title: 'Are you sure?',
            message: 'All your monthly schedules will be deleted',
            confirmLabel: 'Confirm',
            cancelLabel: 'Cancel',
            onConfirm: () => {
                deleteExistingMonthlySchedules()
                addRecommendedMonthlySchedules()
            }
        })
        let defaultMonthlyPostSchedules = []
        if (monthlyScheduleType === 'monthDate') {
            defaultMonthlyPostSchedules = defaultMonthlyDatePostSchedules
        }
        if (monthlyScheduleType === 'monthDay') {
            defaultMonthlyPostSchedules = defaultMonthlyDayPostSchedules
        }
        const deleteExistingMonthlySchedules = async () => {
            const firstPostSchedule = this.props.allPostSchedulesQuery.allPostSchedules[0]
            if (firstPostSchedule) {
                this.props.allPostSchedulesQuery.allPostSchedules[0].monthlySchedules.map(async (schedule) => {
                    this._handleDeleteMonthlyPostSchedule(schedule.id)
                })
            }
        }
        const addRecommendedMonthlySchedules = async () => {
            defaultMonthlyPostSchedules.map(async (schedule) => {
                this._handleAddMonthlyPostSchedule(
                    schedule.monthlyScheduleType,
                    schedule.monthDate,
                    schedule.monthDay,
                    schedule.hour,
                    schedule.minute)
            })
        }
    }
}

SchedulePage.propTypes = {
    selectedSocialProfileId: PropTypes.string
}
export default compose(
    graphql(ALL_POST_SCHEDULES_QUERY, {
        name: 'allPostSchedulesQuery',
        options: (ownProps) => {
            const SPId = ownProps.selectedSocialProfileId
            return {
                variables: { socialProfileId: SPId }
            }}}),
    graphql(DELETE_WEEKLY_POST_SCHEDULE_MUTATION, { name: 'deleteWeeklyPostScheduleMutation'}),
    graphql(DELETE_MONTHLY_POST_SCHEDULE_MUTATION, { name: 'deleteMonthlyPostScheduleMutation'}),
    graphql(ADD_MONTHLY_POST_SCHEDULE_MUTATION, { name: 'addMonthlyPostScheduleMutation'}),
    graphql(ADD_WEEKLY_POST_SCHEDULE_MUTATION, { name: 'addWeeklyPostScheduleMutation'})
)(SchedulePage)