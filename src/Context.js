import React, { Component, createContext } from 'react'

export const defaultContext = {//exported to reference defaults
    sp: {id: null, site: 'facebook', name: 'Choose Profile...',
        industry: {id: null, industry: 'Null'},
        postingPlatform: {id: null, platform: 'IFTTT', iftttEventName: '', iftttKey: '', zapierUrl: ''}
        },
    searchText: '',
    tab: 'settings',
    scheduleType: 'monthly',
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