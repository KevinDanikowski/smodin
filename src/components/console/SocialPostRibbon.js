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
            <div className='w-100 flex items-center justify-end mr3 pa2 overflow-hidden bg-smodin-dark-purple'>
                <i className="fa fa-search fa-lg mr1 white " aria-hidden="true"/>
                <input
                    className='br4 pa1 mr2 gray b--solid-ns b--black-40'
                    type='text'
                    placeholder='Search...'
                    onChange={(e) => this.setState({searchText: e.target.value})}
                />
                <button
                    className='br4 pa1 b--smodin-red bg-smodin-red fw6'
                    onClick={()=>this.props.setContext({searchText: this.state.searchText})}>
                    Search
                </button>
            </div>
        )
    }
}

export default Search
