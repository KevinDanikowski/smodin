import React, { Component } from 'react'
import { graphql, gql, compose } from 'react-apollo'
import { Link } from 'react-router-dom'
import { GC_USER_ID } from '../../src/constants'
import { ALL_INDUSTRIES_QUERY} from "../../graphql/industries";
import './IndustryList.css'

class IndustryList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndustryId: this.props.defaultIndustryId,
            selectedIndustry: this.props.defaultIndustry
        }
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
        const IndustryArrayMap = () => {
            if (this.props.allIndustriesQuery && this.props.allIndustriesQuery.loading) {
                return (
                    <div>
                        {(this.state.selectedIndustryId === 'cj97jd2670t6501027go4pm46') ?
                        <div>
                            <hr className='center w85'></hr>
                            <h4
                                href='#'
                                className='industryoption-selected tc mb2 ml1 mt2'>Generic</h4>
                        </div>
                        :<div>
                            <hr className='center w85'></hr>
                            <h4
                                href='#'
                                className='industryoption tc mb2 ml1 mt2'>Generic</h4>
                        </div>}
                    </div>
                )
            }
            if (this.props.allIndustriesQuery && this.props.allIndustriesQuery.error) {
                return (
                    <div>
                        <hr className='center w85'></hr>
                        <h4
                            href='#'
                            className='industryoption smodin-red tc mb2 ml1 mt2'>Error!</h4>
                    </div>
                )
            }
            return (
                <div>
                    {this.props.allIndustriesQuery.allIndustries.map(industry => (
                        (this.state.selectedIndustryId === industry.id) ?
                        <div key={industry.id}>
                            <hr className='center w85'></hr>
                            <h4
                                href='#'
                                className='industryoption-selected tc mb2 ml1 mt2'>{industry.industry}</h4>
                        </div>
                        :<div key={industry.id}>
                            <hr className='center w85'></hr>
                            <h4
                                href='#'
                                className='industryoption tc mb2 ml1 mt2 pt0 pb0 dark-gray'
                                onClick={() => this._sendIndustryToParent(industry.id, industry.industry)}>{industry.industry}</h4>
                            </div>
                    ))}
                </div>
            )
        }
        return (
            <div className='flex-column justify-between'>
                <div>
                    <h3 className='tc mb2 ml1 mt2 dark-gray'>Industries</h3>
                    <IndustryArrayMap />
                    <hr className='center w85'></hr>
                        <Link to='/industries' className='fw6 dark-gray no-underline'>
                            <div className='industryoption tc mb2 ml1 mt2 '>
                                <i className="pr1 fa fa-plus-circle" aria-hidden="true"></i>
                                Choose Industries
                                <i className="pl1 fa fa-plus-circle" aria-hidden="true"></i>
                            </div>
                        </Link>
                </div>
            </div>
        )
    }
    _sendIndustryToParent = (industryId, industry) => {
        this.setState({selectedIndustryId: industryId, selectedIndustry: industry})
        this.props.receiveIndustry(industryId, industry)
    }
}

export default compose(
    graphql(ALL_INDUSTRIES_QUERY, {
        name: 'allIndustriesQuery',
        skip: (ownProps) => (localStorage.getItem(GC_USER_ID) === null),
        options: (ownProps) => {
            const userId = localStorage.getItem(GC_USER_ID)
            return {
                variables: { id: userId }
            }}})
)(IndustryList)
