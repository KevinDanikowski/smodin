import React, { Component } from 'react'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            searchText: this.props.defaultSearchText,
        }
    }
    render() {
        return (
            <div className='post-ribbon'>
                <i className="fa fa-search fa-lg mr1 white " aria-hidden="true"/>
                <input
                    type='text'
                    placeholder='Search...'
                    onChange={(e) => this.setState({searchText: e.target.value})}
                />
                <button
                    onClick={()=>this.props.setContext({searchText: this.state.searchText})}>
                    Search
                </button>
            </div>
        )
    }
}

export default Search
