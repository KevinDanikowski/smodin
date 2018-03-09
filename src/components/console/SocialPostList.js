import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import { GC_USER_ID } from '../../constants'
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

class SocialPostList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newSocialPost: ''
        }
    }
    componentWillUpdate(nextProps, nextState){
        if (nextProps === this.props) return false
    }
    render() {
        const userId = localStorage.getItem(GC_USER_ID)
        if (!userId){
            return(
                <div>
                    <h1 className="tc">Oops! You're not logged in!</h1>
                    <button onClick={() => {
                        this.props.history.push('/login')
                    }}>Login
                    </button>
                </div>
            )
        }
        const SocialPostArrayMap = () => {
            if (this.props.allSocialPostsQuery && this.props.allSocialPostsQuery.loading) {
                return (
                    <SocialPost
                        socialPost={{message: 'loading...', id: '0'}}
                        index={0}
                        deleteSocialPost={(e)=>console.log('still loading...')}
                        updateSocialPost={(e)=>console.log('still loading...')}
                        allParametersQuery={{allParameters: [{param: 'non param', response: 'non response', id:'0000'}]}}/>
                )
            }
            if (this.props.allSocialPostsQuery && this.props.allSocialPostsQuery.error) {
                return (
                    <SocialPost
                        socialPost={{message: 'error', id: '0'}}
                        index={0}
                        deleteSocialPost={(e)=>console.log('error')}
                        updateSocialPost={(e)=>console.log('error')}
                        allParametersQuery={{allParameters: [{param: 'non param', response: 'non response', id:'0000'}]}}/>
                )
            }
            if (this.props.allSocialPostsQuery){
                return this.props.allSocialPostsQuery.allSocialPosts.map((socialPost, index) => (
                <SocialPost
                    key={socialPost.id}
                    socialPost={socialPost}
                    index={index}
                    searchText={this.props.searchText}
                    selectedIndustryId={this.props.selectedIndustryId}
                    deleteSocialPost={this._handleDeleteSocialPost}
                    updateSocialPost={this._handleUpdateSocialPost}
                    updateSocialPostImage={this._handleUpdateSocialPostImage}
                    allParametersQuery={this.props.allParametersQuery}/>
            ))}
            return (
                <SocialPost
                    socialPost={{message: 'Last Result', id: '0'}}
                    index={0}
                    deleteSocialPost={(e)=>console.log('Last Result')}
                    updateSocialPost={(e)=>console.log('Last Result')}
                    allParametersQuery={{allParameters: [{param: 'non param', response: 'non response', id:'0000'}]}}/>
            )
        }
        return (
            <div className='flex-1 flexbox-parent-console'>
                <div className='flex-1 overflow-auto overflow-y-scroll overflow-x-hidden mr2 mt1 mb1'>
                    <SocialPostArrayMap />
                    <div className='inline-flex items-center mt3 w-100 ml2 mb2'>
                        <input
                            className='flex-1 pa1 br3 b--solid-ns b--black-40'
                            onChange={(e) => this.setState({ newSocialPost: e.target.value })}
                            value={this.state.newSocialPost}
                            placeholder='Your New Post...'
                            type='text'/>
                        <button className='ml3 mr3 bg-green b--dark-green br3 pr2 pl2 pb1 pt1 white-90 fw8'
                                onClick={() => this._handleNewSocialPost()}>Submit</button>
                    </div>
                </div>
                <div className='flex flex-column w350p overflow-hidden bg-smodin-black'>
                    <SocialPostRibbon
                        defaultSearchText={this.props.searchText}
                        receiveSearchText={this._sendSearchTextToParent}/>
                    <div className='w-100 flex flex-column flex-1'>
                        <div className='w-100 h-50'>
                            <ParametersBox
                                selectedIndustryId={this.props.selectedIndustryId} />
                        </div>
                        <div className='w-100 h-50'>
                            <SocialPostBox
                                selectedIndustryId={this.props.selectedIndustryId} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    _handleDeleteSocialPost =  (id) => {
        this.props.deletedSocialPostMutation({
            variables: {
                id: id
            },
            update: (store) => {
                const userId = localStorage.getItem(GC_USER_ID)
                const industryId = this.props.selectedIndustryId
                const data = store.readQuery({query: ALL_SOCIAL_POSTS_QUERY, variables: {
                    id: userId,
                    industryId: industryId,
                    searchText: this.props.searchText
                }})
                const deletedSocialPostIndex = data.allSocialPosts.findIndex((socialPost) => (socialPost.id === id))
                data.allSocialPosts.splice(deletedSocialPostIndex, 1)
                store.writeQuery({query: ALL_SOCIAL_POSTS_QUERY, data, variables: {
                    id: userId,
                    industryId: industryId,
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
        const industryId = this.props.selectedIndustryId
        const userId = localStorage.getItem(GC_USER_ID)
        await this.props.addSocialPostMutation({
            variables: {
                industriesIds: industryId,
                message: newSocialPost,
                id: userId
            },
            update: (store, {data: {createSocialPost} }) => {
                const data = store.readQuery({
                    query: ALL_SOCIAL_POSTS_QUERY,
                    variables: {
                        id: userId,
                        industryId: industryId,
                        searchText: this.props.searchText
                    }
                })
                data.allSocialPosts.push(createSocialPost)
                store.writeQuery({
                    query: ALL_SOCIAL_POSTS_QUERY,
                    data,
                    variables: {
                        id: userId,
                        industryId: industryId,
                        searchText: this.props.searchText
                    }
                })
            }
        })
        this.setState({ newSocialPost: '' })
    }
    _sendSearchTextToParent = (searchText) => {
        this.props.receiveSearchText(searchText)
    }
}


export default compose(
    graphql(ALL_SOCIAL_POSTS_QUERY, {
        name: 'allSocialPostsQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            const industryId = ownProps.selectedIndustryId
            const searchText = ownProps.searchText
            return {
                variables: { id: userId, industryId: industryId, searchText: searchText }
            }}}),
    graphql(ALL_PARAMETERS_QUERY, {
        name: 'allParametersQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            const industryId = ownProps.selectedIndustryId
            return {
                variables: { id: userId, industryId: industryId }
            }}}),
    graphql(ADD_SOCIAL_POSTS_MUTATION, {name: 'addSocialPostMutation'}),
    graphql(UPDATE_SOCIAL_POSTS_MUTATION, {name: 'updateSocialPostMutation'}),
    graphql(UPDATE_SOCIAL_POSTS_IMAGE_MUTATION, {name: 'updateSocialPostImageMutation'}),
    graphql(DELETE_SOCIAL_POSTS_MUTATION, {name: 'deletedSocialPostMutation'})
)(SocialPostList)
