import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { findAllParametersInString } from '../../utils'
import { GC_USER_ID } from '../../constants'
import SocialPostWithCSS from './SocialPostWithCSS'
import TextareaAutosize from 'react-autosize-textarea'
import axios from 'axios'
import Dropzone from 'react-dropzone'
import {ADD_SOCIAL_POST_IMAGE_MUTATION,
    ALL_SOCIAL_POSTS_QUERY} from '../../graphql/socialPosts'
import {UPDATE_FILE_MUTATION,
    DELETE_FILE_MUTATION} from '../../graphql/files'
import PropTypes from 'prop-types'

const GRAPHCOOL_PROJECT_ID = process.env.GRAPHCOOL_PROJECT_ID

class SocialPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: this.props.socialPost.message,
            postChanged: false,
            editing: false,
            viewResponse: false,
            hasImage: false,
            uploading: false,
            removeConfirmation: false,
            imageUrl: '',
            imageFile: [],
            imageFilePresent: false,
        }
    }
    _clickToEdit() {
        this.textarea.focus()
    }
    componentWillMount() {
        if ((this.props.socialPost.image) && (this.props.socialPost.image !== null)) this.setState({
            hasImage: true, imageUrl: this.props.socialPost.image.url })
    }
    render() {
        const PostArea = () => {
            if (this.state.editing) return (
                <div className='flex-5'>
                    <TextareaAutosize
                        onBlur={() => {this.setState({ editing: false})}}
                        type='text'
                        className='socialpostboxresponse'
                        innerRef={(input)=>{this.textarea=input}}
                        value={this.state.message}
                        onChange={(e) => {
                            this.setState({ message: e.target.value});
                            (this.props.socialPost.message !== e.target.value) ?
                                this.setState({ postChanged: true }) : this.setState({ postChanged: false })}}/>
                </div>
            )
            if (!this.state.editing && this.state.viewResponse) {
                if (this.props.allParametersQuery.loading) return (
                    <div className='flex-5 pa0 ma0'><strong>Generating Your Messages.....</strong></div>
                )
                return (
                    <div className='flex-5 pa0 ma0'><strong className='user-select-n'>Rewrite: </strong>{findAllParametersInString(this.props.socialPost.message, '{{', '}}', this.props.allParametersQuery.allParameters)} </div>
                )
            }
            return(
                <div className='flex-5 pointer'
                     onClick={async ()=>{await this.setState({editing: true}); this._clickToEdit()}}>
                    <SocialPostWithCSS
                        allParametersQuery={this.props.allParametersQuery}>{this.state.message}</SocialPostWithCSS>
                </div>
            )

        }
        const ImageArea = () => {
            if (this.state.hasImage) return(
                <div className='flex-1 bw2p br4p b--smodin-gray'>
                    <img src={this.state.imageUrl} alt='post pic'/>
                    {(!this.state.removeConfirmation) ?
                        <div className='tc seg-regular w-100 bg-smodin-red h--bg-smodin-white-p hover-black'
                             onClick={()=>{this._setStateAndTimeout()}}>
                            <i className="fa fa-ban" aria-hidden="true"/>
                        </div>
                        :<div className='tc seg-regular w-100 bg-smodin-red h--bg-smodin-white-p hover-black'
                              onClick={()=>{this._deleteImageFile()}}>
                            Sure?
                        </div>}
                </div>
            )
            if (this.state.imageFilePresent && this.state.uploading) return(
                <div className='flex-1 b--dashed br4p b--smodin-gray h-100'>
                    <div>{this.state.imageFile.map((file,index) => <img key={index}  alt='post pic' className='opacity-05' src={file.preview}/>)}</div>
                </div>
            )
            return(
                (this.state.imageFilePresent)?
                    <div className='flex-1 b--dashed br4p b--smodin-gray h-100 '>
                        <div>{this.state.imageFile.map((file,index) => <img key={index} alt='post pic' className='' src={file.preview}/>)}</div>
                        <div className='flex nowrap'>
                            <div className='tc seg-regular w-100 bg-smodin-red h--bg-smodin-white-p hover-black'
                                 onClick={()=>{this.setState({imageFile: [], imageFilePresent: false})}}>
                                <i className="fa fa-ban" aria-hidden="true"/>
                            </div>
                            <div className='tc seg-regular w-100 bg-smodin-green h--bg-smodin-white-p hover-black'
                                 onClick={()=>{this._uploadImageFile()}}>
                                <i className="fa fa-check" aria-hidden="true"/>
                            </div>
                        </div>
                    </div>
                    :<Dropzone
                        onDrop={this._onDrop.bind(this)}
                        className='flex items-center justify-center flex-1 pl1 b--dashed bw2p br4p b--smodin-gray'
                        activeClassName='bg-green'
                        multiple={false}>
                        <i className="fa fa-picture-o smodin-gray" aria-hidden="true"/>
                    </Dropzone>
            )
        }
        const BottomBar = () => {
            return (
                <div className='post-bottom fs20p bg-smodin-blue-gray flex border-top b--smodin-gray  pt1p smodin-dark-gray pb2p nowrap'>
                    <div className='flex inline-flex justify-start ml1 items-center flex-1'>
                        <i className="ps2p fa fa-link mr1" aria-hidden="true"/>
                        <div className=''>Link...</div>
                    </div>
                    <div className='flex inline-flex justify-start items-center flex-1'>
                        <i className="ps2p fa fa-picture-o mr1 " aria-hidden="true"/>
                        <div className=''>Image Link...</div>
                    </div>
                    <div className='flex inline-flex justify-start items-center pr2'>
                        <i className="ps2p fa fa-clock-o mr1" aria-hidden="true"/>
                        <div className=''>8/2/17 16:12</div>
                    </div>
                    <div className='pl2 flex inline-flex justify-end self-end items-center'>
                        {(this.state.viewResponse)?
                            <div className='br4 bg-smodin-red pl1 pr1 mt1p mr1 h--bg-smodin-red-p white'
                                 onClick={() => this.setState({viewResponse: true})}>
                                <i className="fa fa-eye mr1" aria-hidden="true"/>
                                <i className="fa fa-pencil-square-o" aria-hidden="true"/>
                            </div>
                            :<div className='br4 bg-smodin-gray pl1 pr1 mt1p mr1 h--bg-smodin-red-p hover-white'
                                  onClick={() => this.setState({viewResponse: true})}>
                                <i className="fa fa-eye mr1" aria-hidden="true"/>
                                <i className="fa fa-pencil-square-o" aria-hidden="true"/>
                            </div>}
                        <i className="ps2p fa fa-files-o pl1 pr1 mr1" aria-hidden="true"/>
                        {(this.state.postChanged) ?
                            <i className="ps2p fa fa-floppy-o mr1 bg-smodin-red br2 pl1 pr1 pointer white" aria-hidden="true" onClick={this._updateSocialPost}/>
                            :<i className="ps2p fa fa-floppy-o pl1 pr1 mr1" aria-hidden="true"/>}
                        <i className="mr1 ps2p fa fa-trash h--smodin-red-p" aria-hidden="true" onClick={this._deleteSocialPost}/>
                    </div>
                </div>
            )
        }
        return (
            <div className='social-post'>
                <div className='post-top'>
                    <PostArea />
                    <ImageArea />
                </div>
                <BottomBar />
            </div>
        )
    }
    _setStateAndTimeout = () => {
        this.setState({ removeConfirmation: true })
        const _setNewState = () => {
            this.setState({ removeConfirmation: false})
        }
        setTimeout(function(){_setNewState()}, 2500)
    }
    _deleteImageFile = async () => {
        // THIS DOESN'T WORK, GET AN ERROR, SEND NILAN ok  MESSAGE
        const socialPostId = this.props.socialPost.id
        //const imageId = this.props.socialPost.image.id
        await this.props.deleteImageFileMutation({
            variables: {
                id: this.props.socialPost.image.id
            },
            update: (store) => {
                console.log('test')
                const userId = localStorage.getItem(GC_USER_ID)
                const SPId = this.props.spId
                const data = store.readQuery({query: ALL_SOCIAL_POSTS_QUERY, variables: {
                    id: userId,
                    socialProfileId: SPId,
                    searchText: this.props.searchText
                }})
                const socialPostIndex = data.allSocialPosts.findIndex((socialPost) => (socialPost.id === socialPostId))
                console.log(socialPostIndex, data.allSocialPosts.socialPost[socialPostIndex])
                data.allSocialPosts.socialPost[socialPostIndex].image = null
                store.writeQuery({query: ALL_SOCIAL_POSTS_QUERY, data, variables: {
                    id: userId,
                    socialProfileId: SPId,
                    searchText: this.props.searchText
                }}).catch(res => { const errors = res.graphQLErrors; console.log(errors)})
            }
        })
    }
    _deleteSocialPost = () => {
        const id = this.props.socialPost.id
        this.props.deleteSocialPost(id)
    }
    _updateSocialPost = () => {
        const id = this.props.socialPost.id
        const newMessage = this.state.message
        this.props.updateSocialPost(id, newMessage)
        this.setState({ postChanged: false })
    }
    _onDrop(imageFile) {
        this.setState({
            imageFile: imageFile, imageFilePresent: true
        })
        console.log(imageFile)
    }
    _uploadImageFile = async () => {
        this.setState({uploading: true})
        const imageFile = this.state.imageFile[0]
        let data = new FormData()
        const url = 'https://api.graph.cool/file/v1/' + GRAPHCOOL_PROJECT_ID
        data.append('data', imageFile)
        await axios.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(response => {
            console.log('file upload response', response)
            const userId = localStorage.getItem(GC_USER_ID)
            const id = response.data.id
            const socialPostId = this.props.socialPost.id
            this.props.updateFileMutation({
                variables: {
                    id: id,
                    userId: userId
                }
            })
            console.log('success!', this.props)
            this.props.updateSocialPostImage(socialPostId, id)
            console.log('new', this.props)
        })
        this.setState({imageFile: [], imageFilePresent: false, uploading: false})
    }
}

SocialPost.propTypes = {
    spId: PropTypes.string
}

export default compose(
    graphql(ADD_SOCIAL_POST_IMAGE_MUTATION, {name: 'addSocialPostImageMutation'}),
    graphql(UPDATE_FILE_MUTATION, {name: 'updateFileMutation'}),
    graphql(DELETE_FILE_MUTATION, {name: 'deleteImageFileMutation'}),
)(SocialPost)


/*
RELEVANT LINKS
https://www.graph.cool/docs/reference/graphql-api/file-management-eer4wiang0/#current-limitations
https://github.com/graphcool/content/issues/95
https://github.com/graphcool/framework/blob/master/server/backend-api-system/src/main/scala/cool/graph/system/mutations/AddFieldMutation.scala
https://github.com/HriBB/graphql-server-express-upload
https://www.npmjs.com/package/apollo-upload-client
https://css-tricks.com/image-upload-manipulation-react/
https://react-dropzone.js.org/
https://stackoverflow.com/questions/38349421/react-dropzone-image-preview-not-showing
 */