import React, { Component } from 'react'

class Industry extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userIndustry: false,
            removeConfirmation: false
        }
    }
    componentWillMount() {
        const allUserIndustriesQuery = this.props.allUserIndustriesQuery
        const industryId = this.props.industryId
        this.checkForIndustryId(allUserIndustriesQuery, industryId)
    }
    checkForIndustryId = (allUserIndustriesQuery, industryId) => {
        let allUserIndustryIds = allUserIndustriesQuery.allIndustries.map(industry => {return industry.id})
        if (allUserIndustryIds.includes(industryId)) {
            this.setState({userIndustry: true})
        } else { return null }
    }
    render() {
        return (
            <div className='ma3 mw300p'>
                {(this.state.userIndustry) ?
                <div className='industry-box-user flex items-center h-100'>
                    <div className='pt1 pb1 fw4 black flex-1 text-capitalize ma1 ml2'>{this.props.industry}</div>
                    {(!this.state.removeConfirmation) ?
                    <div
                        className='industry-box-user-button justify-center items-center flex white fw6 self-stretch ws-normal w50p bg-smodin-red'
                        onClick={this._setStateAndTimeout}>
                        X
                    </div>
                    :<div
                        className='industry-box-user-button justify-center items-center flex white fw6 self-stretch ws-normal w70p bg-smodin-red'
                        onClick={this._removeIndustry}>
                        Sure?
                    </div>}
                </div>
                :<div className='industry-box flex items-center h-100'>
                    <div className='pt1 pb1 fw4 black flex-1 text-capitalize ma1 ml2'>{this.props.industry}</div>
                    <div
                        className='industry-box-button justify-center items-center flex white fw6 self-stretch ws-normal w50p bg-smodin-red'
                        onClick={this._addIndustry}>
                        Add
                    </div>
                </div>}
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
    _addIndustry = () => {
        const industryId = this.props.industryId
        this.props.addIndustry(industryId)
        this.setState({ userIndustry: true })
    }//
    _removeIndustry = () => {
        const industryId = this.props.industryId
        this.props.removeIndustry(industryId)
        this.setState({ userIndustry: false, removeConfirmation: false })
    }
}

export default Industry