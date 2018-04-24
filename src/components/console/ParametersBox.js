import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import {ALL_PARAMETERS_QUERY} from "../../graphql/parameters";
import HighlightParameters from './HighlightParameters'
import LoadingIcon from '../independent/LoadingIcon'

class ParametersBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editingParameter: false
        }
    }
    render() {
        //par-border
        const PostListArray = () => {
            if (this.props.allParametersQuery &&
                !this.props.allParametersQuery.loading &&
                !this.props.allParametersQuery.error) return(
                <React.Fragment>
                    {this.props.allParametersQuery.allParameters.map((parameter, index) => (
                        <div key={index} className='par-wrapper'>
                            <HighlightParameters
                                key={index}
                                allParametersQuery={this.props.allParametersQuery}>{`{{${parameter.param}}}`}</HighlightParameters>
                        </div>
                    ))}
                </React.Fragment>
            )
            else return <LoadingIcon/>
        }
        return (
            <div className='borders flexbox-parent-console bg-smodin-black overflow-hidden b--smodin-gray mr0'>
                <div className='flex flex-wrap flex-auto bg-smodin-white pa1 h-100 overflow-y-auto overflow-x-hidden'>
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

ParametersBox.propTypes = {
    spId: PropTypes.string
}

export default graphql(ALL_PARAMETERS_QUERY, {
    name: 'allParametersQuery',
    skip: (ownProps)=>ownProps.spId === null,
    options: (ownProps) => {
            return {
                variables: { socialProfileId: ownProps.spId }
            }}}
)(ParametersBox)
