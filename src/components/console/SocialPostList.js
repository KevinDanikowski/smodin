import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import SocialPost from './SocialPost'
import ParametersBox from './ParametersBox'
import SocialPostBox from './SocialPostBox'
import {ALL_SOCIAL_POSTS_QUERY,
    ADD_SOCIAL_POSTS_MUTATION,
    UPDATE_SOCIAL_POSTS_IMAGE_MUTATION,
    UPDATE_SOCIAL_POSTS_MUTATION,
    DELETE_SOCIAL_POSTS_MUTATION} from "../../graphql/socialPosts";
import SocialPostRibbon from './SocialPostRibbon'
import {ALL_PARAMETERS_QUERY} from "../../graphql/parameters";
import PropTypes from 'prop-types'
import LoadingIcon from '../independent/LoadingIcon'
import ErrorIcon from '../independent/ErrorIcon'

class SocialPostList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newSocialPost: ''
        }
    }
    render() {
        const sp = this.props.sp
        const SocialPostArrayMap = () => {
            if (!this.props.allSocialPostsQuery || this.props.allSocialPostsQuery.loading) {
                return <LoadingIcon />
            }
            if (this.props.allSocialPostsQuery.error) {
                return <ErrorIcon/>
            }
            return this.props.allSocialPostsQuery.allSocialPosts.map((socialPost, index) =>
                <SocialPost
                    key={socialPost.id}
                    socialPost={socialPost}
                    searchText={this.props.searchText}
                    spId={sp.id}
                    deleteSocialPost={this._handleDeleteSocialPost}
                    updateSocialPost={this._handleUpdateSocialPost}
                    updateSocialPostImage={this._handleUpdateSocialPostImage}
                    allParametersQuery={this.props.allParametersQuery}/>)
        }
        const RightColumn = () =>
            <div className='right-post-column'>
                <SocialPostRibbon setContext={this.props.setContext}/>
                <div className='w-100 flex flex-column flex-1'>
                    <div className='w-100 h-50'>
                        <ParametersBox
                            spId={sp.id} />
                    </div>
                    <div className='w-100 h-50'>
                        <SocialPostBox
                            industryId={sp.industry.id || null} />
                    </div>
                </div>
            </div>


        return (
            <div id='social-post-page'>
                <div className='post-column'>
                    <div className='posts'>
                        <SocialPostArrayMap />
                    </div>
                    <div className='new-post'>
                        <input
                               onChange={(e) => this.setState({ newSocialPost: e.target.value })}
                               value={this.state.newSocialPost}
                               placeholder='Your New Post...'
                               type='text'/>
                        <button onClick={() => this._handleNewSocialPost()}>Submit</button>
                    </div>
                </div>
                <RightColumn />
            </div>
        )
    }
    _handleDeleteSocialPost =  (id) => {
        this.props.deletedSocialPostMutation({
            variables: {
                id: id
            },
            update: (store) => {
                const SPId = this.props.sp.id
                const data = store.readQuery({query: ALL_SOCIAL_POSTS_QUERY, variables: {
                        socialProfileId: SPId,
                        searchText: this.props.searchText
                    }})
                const deletedSocialPostIndex = data.allSocialPosts.findIndex((socialPost) => (socialPost.id === id))
                data.allSocialPosts.splice(deletedSocialPostIndex, 1)
                store.writeQuery({query: ALL_SOCIAL_POSTS_QUERY, data, variables: {
                        socialProfileId: SPId,
                        searchText: this.props.searchText
                    }})
            }
        })
    }
    _handleUpdateSocialPost = async (id, newMessage) => {
        await this.props.updateSocialPostMutation({
            variables: {
                id: id,
                message: newMessage
            }
        })
    }
    _handleUpdateSocialPostImage =  async (id, imageFileId) => {
        await this.props.updateSocialPostImageMutation({
            variables: {
                id: id,
                imageId: imageFileId
            }
        })
    }
    _handleNewSocialPost = async () => {
        const { newSocialPost } = this.state
        const SPId = this.props.sp.id
        await this.props.addSocialPostMutation({
            variables: {
                socialProfileId: SPId,
                message: newSocialPost,
            },
            update: (store, {data: {createSocialPost} }) => {
                const data = store.readQuery({
                    query: ALL_SOCIAL_POSTS_QUERY,
                    variables: {
                        socialProfileId: SPId,
                        searchText: this.props.searchText
                    }
                })
                data.allSocialPosts.push(createSocialPost)
                store.writeQuery({
                    query: ALL_SOCIAL_POSTS_QUERY,
                    data,
                    variables: {
                        socialProfileId: SPId,
                        searchText: this.props.searchText
                    }
                })
            }
        })
        this.setState({ newSocialPost: '' })
    }
}

SocialPostList.propTypes = {
    sp: PropTypes.object.isRequired,
    setContext: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired
}
export default compose(
    graphql(ALL_SOCIAL_POSTS_QUERY, {
        name: 'allSocialPostsQuery',
        options: (ownProps) => {
            const SPId = ownProps.sp.id
            const searchText = ownProps.searchText
            return {
                variables: { socialProfileId: SPId, searchText: searchText }
            }}}),
    graphql(ALL_PARAMETERS_QUERY, {
        name: 'allParametersQuery',
        skip: (ownProps)=>ownProps.sp.id === null,
        options: (ownProps) => {
            const SPId = ownProps.sp.id
            return {
                variables: { socialProfileId: SPId }
            }}}),
    graphql(ADD_SOCIAL_POSTS_MUTATION, {name: 'addSocialPostMutation'}),
    graphql(UPDATE_SOCIAL_POSTS_MUTATION, {name: 'updateSocialPostMutation'}),
    graphql(UPDATE_SOCIAL_POSTS_IMAGE_MUTATION, {name: 'updateSocialPostImageMutation'}),
    graphql(DELETE_SOCIAL_POSTS_MUTATION, {name: 'deletedSocialPostMutation'})
)(SocialPostList)
