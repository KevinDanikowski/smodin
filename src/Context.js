import React, { Component, createContext } from 'react'

const defaultSearchText = ''
const defaultTab = 'posts'
const defaultScheduleType = 'monthly'
const defaultSite = 'facebook'
const defaultColumnTwo = 'profilemenu'
const defaultSelectedSocialProfileId = null
const defaultSelectedSocialProfile = {id: null, site: 'facebook', name: 'Name...', industry: {id: null}}

const defaultContext = {
    sp: defaultSelectedSocialProfile,
    searchText: defaultSearchText,
    tab: defaultTab,
    scheduleType: defaultScheduleType,
    selectedSocialProfile: defaultSelectedSocialProfile,//todo get rid of
    selectedSocialProfileId: defaultSelectedSocialProfileId,
    site: defaultSite,
    columnTwo: defaultColumnTwo
}

//accepts defaultState if no value passed
const Context = createContext()

export class Provider extends Component {
    constructor(props){
        super(props)
        this.state = defaultContext
        this.functions = {
            setContext: async (updatedState)=> {
                await this.setState(updatedState)
            }
        }
    }

    render() {
        return(
            <Context.Provider value={{...this.state, ...this.functions}}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export const { Consumer } = Context

/*
NOTES:
Consumers require a function as a child
 */