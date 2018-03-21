import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import { GC_USER_ID } from '../constants'
import SocialPost from './SocialPost'
import ParametersBox from './ParametersBox'
import SocialPostBox from './SocialPostBox'
import { ALL_PARAMETERS_QUERY } from './ParameterList'

class SocialPostList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newSocialPost: ''
        }
    }
    componentWillUpdate(nextProps, nextState){
        if (nextProps.selectedIndustryId === this.props.selectedIndustryId) return
        if (nextProps.searchText === this.props.searchText) return
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
        if (this.props.allSocialPostsQuery && this.props.allSocialPostsQuery.loading) {
            return (
                <div>
                    Loading...
                </div>
            )
        }
        if (this.props.allSocialPostsQuery && this.props.allSocialPostsQuery.error) {
            return (
                <div>
                    {this.props.allSocialPostsQuery.error}
                </div>
            )
        }
        return (
            <div className='flex-1 w-100 h-100 flex flex-column justify-start items-stretch content-stretch '>
                <div className='flex-1 overflow-auto overflow-y-scroll'>
                    {this.props.allSocialPostsQuery.allSocialPosts.map((socialPost, index) => (
                        <SocialPost
                            key={socialPost.id}
                            socialPost={socialPost}
                            index={index}
                            deleteSocialPost={this._handleDeleteSocialPost}
                            updateSocialPost={this._handleUpdateSocialPost}
                            allParametersQuery={this.props.allParametersQuery}/>
                    ))}
                    <div>
                        <form className='mt3'>
                            <input
                                onChange={(e) => this.setState({ newSocialPost: e.target.value })}
                                value={this.state.newSocialPost}
                                placeholder='Your New Post...'
                                type='text'/>
                        </form>
                        <button className='button mt3' onClick={() => this._handleNewSocialPost()}>Submit</button>
                    </div>
                </div>
                <div className='w350p bg-black-20'>
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
    _handleUpdateSocialPost =  (id, newMessage) => {
        this.props.updateSocialPostMutation({
            variables: {
                id: id,
                message: newMessage
            }
        })
    }
    _handleNewSocialPost = async () => {
        const { newSocialPost } = this.state
        const userId = localStorage.getItem(GC_USER_ID)
        await this.props.addSocialPostMutation({
            variables: {
                message: newSocialPost,
                id: userId
            },
            update: (store, {data: {createSocialPost} }) => {
                const industryId = this.props.selectedIndustryId
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
        });
        this.setState({ newSocialPost: '' })
    }
}
const ALL_SOCIAL_POSTS_QUERY = gql`
  query AllSocialPostsQuery ($id: ID!, $industryId: ID!, $searchText: String!) {
    allSocialPosts (orderBy: default_DESC, filter:{AND: [{
        user: {
            id: $id
            }
        },{
            industries_some: { 
                id: $industryId
                }
        },{
        message_contains: $searchText
      }]}){
          id
          default
          message
          industries {id}
        }}`
const ADD_SOCIAL_POSTS_MUTATION = gql`
    mutation AddSocialPostMutation($id: ID!, $message: String!){
        createSocialPost(userId: $id, message: $message){
            message
            id
            default
            industries {id}
    }}`
const UPDATE_SOCIAL_POSTS_MUTATION = gql`
    mutation UpdateSocialPost($id: ID!, $message: String!){
        updateSocialPost(id: $id, message: $message){
            id
            message
    }}`
const DELETE_SOCIAL_POSTS_MUTATION = gql`
  mutation DeletedSocialPostMutation($id: ID!) {
    deleteSocialPost(id: $id) {
      id
    }
  }
`
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
    graphql(DELETE_SOCIAL_POSTS_MUTATION, {name: 'deletedSocialPostMutation'})
)(SocialPostList)