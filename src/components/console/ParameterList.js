import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import { GC_USER_ID } from '../../constants'
import Parameter from './Parameter'
import './ParameterList.css'

class ParameterList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newParameter: '',
            newResponse: '',
        }
    }
    componentWillUpdate(nextProps, nextState){
        if (nextProps === this.props || nextState === this.state) return false
    }
    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        if (!userId){
            return(
                <div>
                    <h1 className="tc">Oops! You are not logged in!</h1>
                    <button onClick={() => {
                        this.props.history.push('/login')
                    }}>Login
                    </button>
                </div>
            )
        }
        const RowHeader = () => {
            return(
                <thead>
                    <tr>
                        <th id='parameterstable-th-td'>Number</th>
                        <th id='parameterstable-th-td'>Parameter</th>
                        <th id='parameterstable-th-td'>Response</th>
                        <th id='parameterstable-th-td'>Options</th>
                    </tr>
                </thead>
            )
        }
        const RowsParameterArrayMap = () => {
            if (this.props.allParametersQuery && this.props.allParametersQuery.loading) {
                return (
                    <Parameter
                        parameter={{param: 'loading...',response: 'loading...',id: '0'}}
                        index={0}
                        deleteParameter={(e)=>console.log('still loading...')}
                        updateParameter={(e)=>console.log('still loading...')}/>
                )
            }
            if (this.props.allParametersQuery && this.props.allParametersQuery.error) {
                return (
                    <Parameter
                        parameter={{param: 'Error...',response: 'Error...',id: '0'}}
                        index={0}
                        deleteParameter={(e)=>console.log('error')}
                        updateParameter={(e)=>console.log('error')}/>
                )
            }
            return this.props.allParametersQuery.allParameters.map((parameter, index) => (
                <Parameter
                    key={parameter.id}
                    parameter={parameter}
                    index={index}
                    deleteParameter={this._handleDeleteParameter}
                    updateParameter={this._handleUpdateParameter}/>
            ))
        }
        return (
            <div>
                <table className='mt2 center' id='parameterstable'>
                    <RowHeader />
                    <RowsParameterArrayMap />
                    <tr id='parameterstable-tr'>
                        <td id='parameterstable-th-td'>#</td>
                        <td id='parameterstable-th-td'>
                                <span className='parameterinputsidetext nowrap mr5'>
                                    <span>{'{{'}</span>
                                        <input
                                        className='parameterinput b--solid-ns b--black-10'
                                        onChange={(e) => this.setState({ newParameter: e.target.value })}
                                        value={this.state.newParameter}
                                        placeholder='Your New Parameter...'
                                        type='text'/>
                                        <span>{'}}'}</span>
                                </span>
                        </td>
                        <td id='parameterstable-th-td'>
                            <input
                                className='pa1 br3 b--solid-ns b--black-40'
                                onChange={(e) => this.setState({ newResponse: e.target.value })}
                                value={this.state.newResponse}
                                placeholder='Your New Response...'
                                type='text'/>
                        </td>
                        <td id='parameterstable-th-td'>
                            <button
                                className='bg-green b--dark-green br3 pr2 pl2 pb1 pt1 white-90 fw8'
                                onClick={() => {this._handleNewParameter()}}>Submit</button>
                        </td>
                    </tr>
                </table>
            </div>
        )
    }
    _handleDeleteParameter =  (id) => {
        this.props.deletedParameterMutation({
            variables: {
                id: id
            },
            update: (store) => {
                const userId = localStorage.getItem(GC_USER_ID)
                const industryId = this.props.selectedIndustryId
                const data = store.readQuery({query: ALL_PARAMETERS_QUERY, variables: { id: userId, industryId: industryId }})
                const deletedParameterIndex = data.allParameters.findIndex((parameter) => (parameter.id === id))
                data.allParameters.splice(deletedParameterIndex, 1)
                store.writeQuery({query: ALL_PARAMETERS_QUERY, data, variables: { id: userId, industryId: industryId }})
            }
        })
    }
    _handleUpdateParameter =  (id, newParam, newResponse) => {
        this.props.updateParameterMutation({
            variables: {
                id: id,
                param: newParam,
                response: newResponse
            }
        })
    }
    _handleNewParameter = async () => {
        const { newParameter, newResponse } = this.state
        const userId = localStorage.getItem(GC_USER_ID)
        const industryId = this.props.selectedIndustryId
        await this.props.addParameterMutation({
            variables: {
                industriesIds: industryId,
                param: newParameter,
                response: newResponse,
                userId: userId
            },
            update: (store, {data: {createParameter} }) => {
                const data = store.readQuery({
                    query: ALL_PARAMETERS_QUERY,
                    variables: { id: userId, industryId: industryId }
                })
                data.allParameters.push(createParameter)
                store.writeQuery({
                    query: ALL_PARAMETERS_QUERY,
                    data,
                    variables: { id: userId, industryId: industryId }
                })
            }
        })
        this.setState({ newParameter: '', newResponse: ''})
    }
}

// export this query to be reached in SocialPostList.js
export const ALL_PARAMETERS_QUERY = gql`
  query AllParametersQuery ($id: ID!, $industryId: ID!) {
    allParameters (orderBy: default_DESC, filter: {AND: [{
        user: {
            id: $id
            }
        },{
        industries_some: {
            id: $industryId
            }
        }]}){
          id
          default
          param
          response
          industries {id}
        }}`
const ADD_PARAMETER_MUTATION = gql`
    mutation AddParameterMutation( $userId: ID!, $industriesIds: [ID!], $param: String!, $response: String!){
        createParameter( userId: $userId,  industriesIds: $industriesIds, param: $param, response: $response){
            param
            response
            id
            default
            industries {id}
    }}`
const UPDATE_PARAMETER_MUTATION = gql`
    mutation UpdateParameterMutation( $id: ID!, $param: String!, $response: String!){
        updateParameter( id: $id,  param: $param, response: $response){
            id
            param
            response
    }}`
const DELETE_PARAMETER_MUTATION = gql`
  mutation DeleteParameterMutation($id: ID!) {
    deleteParameter(id: $id) {
      id
    }
  }
`
export default compose(
    graphql(ALL_PARAMETERS_QUERY, {
        name: 'allParametersQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            const industryId = ownProps.selectedIndustryId
            return {
                variables: { id: userId, industryId: industryId }
        }}}),
    graphql(ADD_PARAMETER_MUTATION, {name: 'addParameterMutation'}),
    graphql(UPDATE_PARAMETER_MUTATION, {name: 'updateParameterMutation'}),
    graphql(DELETE_PARAMETER_MUTATION, {name: 'deletedParameterMutation'})
)(ParameterList)

//left off trying to find how to  utomatically update parameters

