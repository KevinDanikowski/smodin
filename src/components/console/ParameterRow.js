import React, { Component } from 'react'

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
                        <span className='parameterinputsidetext nowrap'>
                            <span>{'{{'}</span>
                                {this.props.parameter.param}
                            <span>{'}}'}</span>
                        </span>
                    :   <span className='parameterinputsidetext nowrap'>
                            <span>{'{{'}</span>
                                <input  className='parameterinput b--solid-ns b--black-10'
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
                    <input
                        type='text'
                        className='pa1 br3 b--solid-ns b--black-40'
                        value={this.state.response}
                        onChange={(e) => { this.setState({ response: e.target.value});
                            (this.props.parameter.response !== e.target.value) ?
                                this.setState({ updateParameter: true })
                                :   this.setState({ updateParameter: false })}}/>
                </div>
                <div className='param-options'>
                    <a className='ml1 dark-blue hover-gray pointer' onClick={this._deleteParameter}>Delete</a>
                    {(this.state.updateParameter)?
                        <a className='ml1 red hover-gray pointer' onClick={this._updateParameter}>Update</a>
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