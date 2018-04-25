import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'

class Parameter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            param: this.props.parameter.param,
            response: this.props.parameter.response,
            updateParameter: false
        }
    }
    render() {
        return (
            <div className='parameter-row'>
                <div className='param-number'>{this.props.index + 1}</div>
                <div className='param-parameter'>
                    {(this.props.parameter.default)?
                        <span className='param-text'>
                            <span>{`{{${this.props.parameter.param}}}`}</span>
                        </span>
                    :   <span className='param-text'>
                            <span>{'{{'}</span>
                                <input
                                        type='text'
                                        value={this.state.param}
                                        onChange={(e) => { this.setState({ param: e.target.value});
                                            (this.props.parameter.param !== e.target.value) ?
                                                this.setState({ updateParameter: true })
                                            :   this.setState({ updateParameter: false })}}/>
                            <span>{'}}'}</span>
                        </span>}
                </div>
                <div className='param-response'>
                    <textarea
                        rows='1'
                        placeholder='Empty!'
                        value={this.state.response}
                        onChange={(e) => { this.setState({ response: e.target.value});
                            (this.props.parameter.response !== e.target.value) ?
                                this.setState({ updateParameter: true })
                                :   this.setState({ updateParameter: false })}}/>
                </div>
                <div className='param-options'>
                    <FontAwesome name='trash' className='dark-blue hover-gray pointer' onClick={this._deleteParameter} size='lg'/>
                    {(this.state.updateParameter)?
                        <FontAwesome name='save' className='ml2 red hover-gray pointer' onClick={this._updateParameter} size='lg'/>
                        :   null }
                </div>
            </div>
        )
    }
    _updateParameter = () => {
        const id = this.props.parameter.id
        const newParam = this.state.param
        const newResponse = this.state.response
        this.props.updateParameter(id, newParam, newResponse)
        this.setState({ updateParameter: false })
    }
    _deleteParameter = () => {
        const id = this.props.parameter.id
        this.props.deleteParameter(id)
    }
}

export default Parameter