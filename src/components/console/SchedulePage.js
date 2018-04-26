import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { dayArray, defaultWeeklyPostSchedules, defaultMonthlyDatePostSchedules, defaultMonthlyDayPostSchedules } from '../../constants'
import {ADD_MONTHLY_POST_SCHEDULE_MUTATION,
    ADD_WEEKLY_POST_SCHEDULE_MUTATION,
    ALL_POST_SCHEDULES_QUERY,
    ALL_WEEKLY_POST_SCHEDULES_QUERY,
    ALL_MONTHLY_POST_SCHEDULES_QUERY,
    DELETE_MONTHLY_POST_SCHEDULE_MUTATION,
    DELETE_WEEKLY_POST_SCHEDULE_MUTATION} from "../../graphql/schedules";
import { ALL_SOCIAL_PROFILES_QUERY} from "../../graphql/socialProfiles"
import {Tabs, Tab} from 'material-ui/Tabs'
import MonthlyDatePostScheduler from './MonthlyDatePostScheduler'
import MonthlyDayPostScheduler from './MonthlyDayPostScheduler'
import Scheduler from './Scheduler'
import PropTypes from 'prop-types'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import RaisedButton from 'material-ui/RaisedButton';

class SchedulePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            weeklySchedules: [],
            monthlySchedules: [],
        }
    }
    componentWillUpdate(nextProps, nextState){
        if (nextProps === this.props) return false
    }
    componentWillReceiveProps(nextProps, nextState){
        const weeklyQuery = nextProps.allWeeklyPostSchedulesQuery //updates weekly and monthly schedules in state
        if (weeklyQuery && !weeklyQuery.loading && !weeklyQuery.error){
            this.setState({
                weeklySchedules: weeklyQuery.allWeeklyPostSchedules,
            })
        }
        const monthlyQuery = nextProps.allMonthlyPostSchedulesQuery //updates weekly and monthly schedules in state
        if (monthlyQuery && !monthlyQuery.loading && !monthlyQuery.error){
            this.setState({
                monthlySchedules: monthlyQuery.allMonthlyPostSchedules,
            })
        }//TODO JUST FINISHED CHECKING THIS WORKS, NOW ADJUST DELETING AND ADDING
    }
    render() {
        const Ribbon = () => {
            return(
                <div className='sch-header'>
                    <Tabs className='sch-tabs' value={this.props.scheduleType}
                          onChange={(val)=>this.props.setContext({scheduleType: val})}>
                        <Tab label='Monthly' value='MONTHLY'/>
                        <Tab label='Weekly' value='WEEKLY'/>
                    </Tabs>
                </div>
            )
        }
        const DayScheduleArrayTopRow = () => {
            const weeklySchedules = this.state.weeklySchedules
            return dayArray.map((dayObject, index) => {
                const filteredWeeklySchedules = weeklySchedules.filter(schedule => schedule.day === dayObject.number)
                return <Scheduler
                            key={index}
                            day={dayObject.day}
                            dayNumber={dayObject.number}
                            weeklySchedules={filteredWeeklySchedules}
                            deleteWeeklyPostSchedule={this._handleDeleteWeeklyPostSchedule}
                            addWeeklyPostSchedule={this._handleAddWeeklyPostSchedule}/>
                }
            )
        }
        const WeeklyScheduleType = () => {
            return(
                <div className='sch flex flex-wrap justify-around content-stretch items-stretch h-100 flex-1'>
                    <DayScheduleArrayTopRow />
                    <div className='sch-box weekly flex flex-column justify-center'>
                        <h3>Options</h3>
                        <hr />
                        <div className='flex justify-center'>
                            <RaisedButton label={'Generate A Schedule'}
                                          onClick={() => this._handleGenerateRecommendedWeeklySchedule()}
                                          style={{minWidth: '80%'}}
                                          backgroundColor={'#673AB7'}
                                          labelColor={'#ffffff'}/>
                        </div>

                    </div>
                </div>
            )

        }
        const MonthlyScheduleType = () => {
            const monthlyDateSchedules = this.state.monthlySchedules.filter((schedule) => {
                    return schedule.monthlyScheduleType === 'monthDate'
                })
            const monthlyDaySchedules = this.state.monthlySchedules.filter((schedule) => {
                    return schedule.monthlyScheduleType === 'monthDay'
                })
            return (
                <div className='sch flex flex-wrap justify-around content-stretch items-stretch h-100 flex-1'>
                    <MonthlyDatePostScheduler
                        deleteMonthlyPostSchedule={this._handleDeleteMonthlyPostSchedule}
                        addMonthlyPostSchedule={this._handleAddMonthlyPostSchedule}
                        generateRecommendedMonthlySchedule={this._handleGenerateRecommendedMonthlySchedule}
                        monthlyDateSchedules={monthlyDateSchedules}/>
                    <MonthlyDayPostScheduler
                        deleteMonthlyPostSchedule={this._handleDeleteMonthlyPostSchedule}
                        addMonthlyPostSchedule={this._handleAddMonthlyPostSchedule}
                        generateRecommendedMonthlySchedule={this._handleGenerateRecommendedMonthlySchedule}
                        monthlyDateSchedules={monthlyDaySchedules}/>
                </div>
            )
        }
        return (
            <div id='schedule-page'>
                <Ribbon />
                {(this.props.scheduleType === 'WEEKLY')?
                    <WeeklyScheduleType />: null}
                {(this.props.scheduleType === 'MONTHLY')?
                    <MonthlyScheduleType />: null}
            </div>
        )
    }
    _handleDeleteWeeklyPostSchedule = (id) => {
        this.props.deleteWeeklyPostScheduleMutation({
            variables: {
                id: id
            },
            update: (store) => {//TODO getting internal server error if make post, then delete one?
                console.log(id)
                const SPId = this.props.spId
                const data = store.readQuery({query: ALL_WEEKLY_POST_SCHEDULES_QUERY, variables: {
                    socialProfileId: SPId
                }})
                const deletedWeeklyPostScheduleIndex = data.allWeeklyPostSchedules.findIndex((weeklyPostSchedule) => (weeklyPostSchedule.id === id))
                data.allWeeklyPostSchedules.splice(deletedWeeklyPostScheduleIndex, 1)
                store.writeQuery({query: ALL_WEEKLY_POST_SCHEDULES_QUERY, data, variables: {
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
                const SPId = this.props.spId
                const data = store.readQuery({query: ALL_MONTHLY_POST_SCHEDULES_QUERY, variables: {
                        socialProfileId: SPId
                    }})
                const deletedMonthlyPostScheduleIndex = data.allMonthlyPostSchedules.findIndex((monthlyPostSchedule) => (monthlyPostSchedule.id === id))
                data.allMonthlyPostSchedules.splice(deletedMonthlyPostScheduleIndex, 1)
                store.writeQuery({query: ALL_MONTHLY_POST_SCHEDULES_QUERY, data, variables: {
                        socialProfileId: SPId
                    }})
            }
        })
    }
    _handleAddWeeklyPostSchedule = async (day, hour, minute) => {
        const SPId = this.props.spId
        await this.props.addWeeklyPostScheduleMutation({
            variables: {
                day: day,
                hour: hour,
                minute: minute,
                socialProfileId: SPId
            },
            update: (store, {data: {createWeeklyPostSchedule} }) => {
                const data = store.readQuery({
                    query: ALL_WEEKLY_POST_SCHEDULES_QUERY,
                    variables: {
                        socialProfileId: SPId
                    }
                })
                data.allWeeklyPostSchedules.push(createWeeklyPostSchedule)
                store.writeQuery({
                    query: ALL_WEEKLY_POST_SCHEDULES_QUERY,
                    variables: {
                        socialProfileId: SPId
                    },
                    data
                })
            }
        })
    }
    _handleAddMonthlyPostSchedule = async (monthlyScheduleType, monthDate, monthDay, hour, minute) => {
        const SPId = this.props.spId
        await this.props.addMonthlyPostScheduleMutation({
            variables: {
                monthlyScheduleType: monthlyScheduleType,
                monthDate: monthDate,
                monthDay: monthDay,
                hour: hour,
                minute: minute,
                socialProfileId: SPId
            },
            update: (store, {data: {createMonthlyPostSchedule} }) => {
                const data = store.readQuery({
                    query: ALL_MONTHLY_POST_SCHEDULES_QUERY,
                    variables: {
                        socialProfileId: SPId
                    }
                })
                data.allMonthlyPostSchedules.push(createMonthlyPostSchedule)
                store.writeQuery({
                    query: ALL_MONTHLY_POST_SCHEDULES_QUERY,
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
            const schedules = this.props.allWeeklyPostSchedulesQuery.allWeeklyPostSchedules
            if(schedules[0]) {
                schedules.map(async (schedule) => {
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
            const schedules = this.props.allMonthlyPostSchedulesQuery.allMonthlyPostSchedules
            if (schedules[0]) {
                schedules.map(async (schedule) => {
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
    spId: PropTypes.string,
    setContext: PropTypes.func.isRequired,
    scheduleType: PropTypes.string
}

export default compose(
    graphql(ALL_WEEKLY_POST_SCHEDULES_QUERY, {
        name: 'allWeeklyPostSchedulesQuery',
        skip: (ownProps) => ownProps.spId === null,
        options: (ownProps) => {
            return {
                variables: {
                    socialProfileId: ownProps.spId
                }}}}),
    graphql(ALL_MONTHLY_POST_SCHEDULES_QUERY, {
        name: 'allMonthlyPostSchedulesQuery',
        skip: (ownProps) => ownProps.spId === null,
        options: (ownProps) => {
            return {
                variables: {
                    socialProfileId: ownProps.spId
                }}}}),
    graphql(DELETE_WEEKLY_POST_SCHEDULE_MUTATION, { name: 'deleteWeeklyPostScheduleMutation'}),
    graphql(DELETE_MONTHLY_POST_SCHEDULE_MUTATION, { name: 'deleteMonthlyPostScheduleMutation'}),
    graphql(ADD_MONTHLY_POST_SCHEDULE_MUTATION, { name: 'addMonthlyPostScheduleMutation'}),
    graphql(ADD_WEEKLY_POST_SCHEDULE_MUTATION, { name: 'addWeeklyPostScheduleMutation'})
)(SchedulePage)