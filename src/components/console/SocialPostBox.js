import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import {ALL_SOCIAL_POST_EXAMPLES_QUERY, ALL_SOCIAL_POST_IDEAS_QUERY} from "../../graphql/socialPosts";
import LoadingIcon from '../independent/LoadingIcon'

class SocialPostBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editingParameter: false,
            tab: 'socialpostexamples'
        }
    }
    render() {
        const SocialPostExamplesArray = () => {
            if (this.props.allSocialPostExamplesQuery &&
                !this.props.allSocialPostExamplesQuery.error &&
                !this.props.allSocialPostExamplesQuery.loading)
                return this.props.allSocialPostExamplesQuery.allSocialPostExamples.map((SocialPost, index) => (
                    <div
                        key={index}
                        className='social-post-example' >{SocialPost.message}</div>
                ))
            else return <LoadingIcon/>
        }
        const SocialPostIdeasArray = () => {
            if (this.props.allSocialPostIdeasQuery &&
                !this.props.allSocialPostIdeasQuery.error &&
                !this.props.allSocialPostIdeasQuery.loading)
                return this.props.allSocialPostIdeasQuery.allSocialPostIdeas.map((SocialPost, index) => (
                    <div
                        key={index}
                        className='social-post-idea' >{SocialPost.idea}</div>
                ))
            else return <LoadingIcon/>
        }
        return (
            <div className='flexbox-parent-console overflow-hidden bg-smodin-black'>
                <div className='borders b--smodin-gray flex-auto flex-auto pa1 bg-smodin-white overflow-auto'>
                    {(this.state.tab === 'socialpostexamples') ?
                        <SocialPostExamplesArray />
                        :<SocialPostIdeasArray />}
                </div>
                <div className='flex w25p '>
                    <div className='flex vertical-lr'>
                        {(this.state.tab === 'socialpostexamples')?
                            <div className='flex flex-column seg-regular post-side-tab-chosen h-50 flex-1'>Examples</div>
                            :<div className='seg-regular post-side-tab white flex-1 ' onClick={(e)=>this.setState({tab: 'socialpostexamples'})}>Examples</div>}
                        {(this.state.tab === 'socialpostideas')?
                            <div className='seg-regular post-side-tab-chosen h-50 flex-1'>Ideas</div>
                            :<div className='seg-regular post-side-tab white flex-1 ' onClick={(e)=>this.setState({tab: 'socialpostideas'})}>Ideas</div>}
                    </div>
                </div>
            </div>
        )
    }
}

export default compose(
    graphql(ALL_SOCIAL_POST_EXAMPLES_QUERY, {
        name: 'allSocialPostExamplesQuery',
        skip: (ownProps)=> ownProps.selectedIndustryId === null,
        options: (ownProps) => {
            const industryId = ownProps.selectedIndustryId
            return {
                variables: { industryId: industryId }
            }}}),
    graphql(ALL_SOCIAL_POST_IDEAS_QUERY, {
        name: 'allSocialPostIdeasQuery',
        skip: (ownProps)=> ownProps.selectedIndustryId === null,
        options: (ownProps) => {
            const industryId = ownProps.selectedIndustryId
            return {
                variables: { industryId: industryId }
            }}})
)(SocialPostBox)
