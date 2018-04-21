import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { ALL_PARAMETERS_QUERY,
    ADD_PARAMETER_MUTATION,
    DELETE_PARAMETER_MUTATION,
    UPDATE_PARAMETER_MUTATION} from "../../graphql/parameters";
import Parameter from './ParameterRow'
import PropTypes from 'prop-types'
import LoadingIcon from '../independent/LoadingIcon'
import ErrorIcon from '../independent/ErrorIcon'

class ParameterList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newParameter: '',
            newResponse: '',
        }
    }
    render() {
        if (!this.props.allParametersQuery || this.props.allParametersQuery.loading) {
            return <LoadingIcon/>
        }
        if (this.props.allParametersQuery.error) {
            return <ErrorIcon/>
        }
        const RowsParameterArrayMap = () => {
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
            <div id='parameters-page'>
                <div className='parameters-header'>
                    <span className='param-number'/>
                    <span className='param-parameter'>Parameter</span>
                    <span className='param-response'>Response</span>
                    <span className='param-options'>Options</span>
                </div>
                <div className='parameters-table'>
                    <RowsParameterArrayMap />
                </div>
                <div className='new-parameter'>
                    <input
                        onChange={(e) => this.setState({ newParameter: e.target.value })}
                        value={this.state.newParameter}
                        placeholder='Parameter...'
                        type='text'/>
                    <input
                        onChange={(e) => this.setState({ newResponse: e.target.value })}
                        value={this.state.newResponse}
                        placeholder='Response...'
                        type='text'/>
                    <button
                        onClick={() => {this._handleNewParameter()}}>Submit</button>
                </div>
            </div>
        )
    }
    _handleDeleteParameter =  (id) => {
        this.props.deletedParameterMutation({
            variables: {
                id: id
            },
            update: (store) => {
                const SPId = this.props.sp.id
                const data = store.readQuery({query: ALL_PARAMETERS_QUERY, variables: { socialProfileId: SPId }})
                const deletedParameterIndex = data.allParameters.findIndex((parameter) => (parameter.id === id))
                data.allParameters.splice(deletedParameterIndex, 1)
                store.writeQuery({query: ALL_PARAMETERS_QUERY, data, variables: { socialProfileId: SPId }})
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
        const SPId = this.props.sp.id
        await this.props.addParameterMutation({
            variables: {
                socialProfileId: SPId,
                param: newParameter,
                response: newResponse,
            },
            update: (store, {data: {createParameter} }) => {
                const data = store.readQuery({
                    query: ALL_PARAMETERS_QUERY,
                    variables: { socialProfileId: SPId }
                })
                data.allParameters.push(createParameter)
                store.writeQuery({
                    query: ALL_PARAMETERS_QUERY,
                    data,
                    variables: { socialProfileId: SPId }
                })
            }
        })
        this.setState({ newParameter: '', newResponse: ''})
    }
}

ParameterList.propTypes = {
    searchText: PropTypes.string,
    sp: PropTypes.object.isRequired
}

export default compose(
    graphql(ALL_PARAMETERS_QUERY, {
        name: 'allParametersQuery',
        skip: (ownProps)=>ownProps.sp.id === null,
        options: (ownProps) => {
            return {
                variables: { socialProfileId: ownProps.sp.id }
            }}}),
    graphql(ADD_PARAMETER_MUTATION, {name: 'addParameterMutation'}),
    graphql(UPDATE_PARAMETER_MUTATION, {name: 'updateParameterMutation'}),
    graphql(DELETE_PARAMETER_MUTATION, {name: 'deletedParameterMutation'})
)(ParameterList)