import React, { Component } from 'react'
import { findAllParametersInString } from '../utils'
import SocialPostWithCSS from './SocialPostWithCSS'
import autosize from 'autosize'

class SocialPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: this.props.socialPost.message,
            postChanged: false,
            focus: false
        }
        this._onBlur = this._onBlur.bind(this)
        this._onFocus = this._onFocus.bind(this)
    }
    componentDidMount() {
        this.textarea.focus()
        autosize(this.textarea)
    }
    _onBlur() {
        setTimeout(() => {
            if (this.state.focus) {
                this.setState({
                    focus: false,
                });
            }
        }, 2);
        console.log('Blurred out ' + this.props.socialPost.id + 'current state: ' + this.state.focus)
    }
    _onFocus() {
        if (!this.state.focus) {
            this.setState({
                focus: true
            });
        }
        console.log('focused on ' + this.props.socialPost.id + 'current state: ' + this.state.focus)

    }
    render() {
        return (
            <div className='socialpostbox mb1'>
                <div className='numbercirclehighlight'>{this.props.index + 1}</div>
                <div className='socialpostboxtop justify-between'>
                    <div className='ml4 mb2 mt1 socialpostboxsocialpost '>
                        <SocialPostWithCSS allParametersQuery={this.props.allParametersQuery}>{this.props.socialPost.message}</SocialPostWithCSS>
                    </div>
                    <div className='socialpostboxdeletebutton'>
                        <a className='ma2' onClick={this._deleteSocialPost}>Delete</a>
                    </div>
                </div>
                <div className='flex'>
                 <input
                    onFocus={this._onFocus}
                    onBlur={this._onBlur}
                    type='text'
                    className='socialpostboxresponse'
                    ref={c=>this.textarea=c}
                    value={this.state.message}
                    onChange={(e) => { this.setState({ message: e.target.value}); (this.props.socialPost.message !== e.target.value) ?  this.setState({ postChanged: true }) : this.setState({ postChanged: false })}}/>
                </div>
                {(this.state.postChanged) ?
                    <button className='button green' onClick={() => { this._updateSocialPost(); this.setState({postChanged: false}) }}>Update</button>
                : null}
                <div>
                    {(this.props.allParametersQuery.loading) ?
                        <p>Generating Your Messages.....</p>
                        :
                        <p>Rewriting: {findAllParametersInString(this.props.socialPost.message, '{{', '}}', this.props.allParametersQuery.allParameters)} </p>
                    }
                </div>
                <button onClick={(e) => console.log(this.state)}>Log State </button>
            </div>
        )
    }
    parameterClicked = (parameterParam, parameterId) =>{
        //NOTE: this will not work when using graphql(QUERY)(component) because need new way to activate child function
        //if (!this.state.focus) return
        let message = this.state.message
        let newMessage = message.concat(' {{' + parameterParam + '}}')
        this.setState({ message: newMessage })
        this.setState({ focus: true })
        console.log(this.state)
    }
    _deleteSocialPost = () => {
        const id = this.props.socialPost.id
        this.props.deleteSocialPost(id)
    }
    _updateSocialPost = () => {
        const id = this.props.socialPost.id
        const newMessage = this.state.message
        this.props.updateSocialPost(id, newMessage)
    }
}

export default SocialPost