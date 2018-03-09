import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { GC_USER_ID } from '../../constants'
import {ALL_PARAMETERS_QUERY} from "../../graphql/parameters";
import './ParametersBox.css'

class ParametersBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editingParameter: false
        }
    }
    render() {
        const PostListArray = () => {
            if (this.props.allParametersQuery.allParameters && this.props.allParametersQuery.allParameters.loading) return <div>Loading...</div>
            if (this.props.allParametersQuery.allParameters && this.props.allParametersQuery.allParameters.error) return <div>Error :(</div>
            if (this.props.allParametersQuery.allParameters) return (
                <div>
                    {this.props.allParametersQuery.allParameters.map((parameter, index) => (
                        <div
                            key={index}
                            className='parameterhover seg-regular fs14p inline-flex flex-wrap ma2p parameterborder bg-smodin-purple smodin-black' >{'{{' + parameter.param + '}}'}</div>
                    ))}
                </div>
            )
            return null
        }
        return (
            <div className='borders flexbox-parent-console bg-smodin-black overflow-hidden b--smodin-gray mr0'>
                <div className='flex-auto bg-smodin-white pa1 h-100 flex-auto overflow-auto'>
                    <PostListArray />
                </div>
                <div className='w25p self-center flex'>
                    <div className='white seg-regular vertical-lr'>
                        Parameters
                    </div>
                </div>
            </div>
        )
    }
}

export default graphql(ALL_PARAMETERS_QUERY, {
        name: 'allParametersQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            const industryId = ownProps.selectedIndustryId
            return {
                variables: { id: userId, industryId: industryId }
            }}}
)(ParametersBox)
