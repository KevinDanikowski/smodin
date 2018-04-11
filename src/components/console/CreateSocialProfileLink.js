import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class CreateSocialProfileLink extends Component {
    render() {
        return (
            <div className='flex justify-center items-center'>
                <Link to='/create-profile' className=''>
                    <button className='h-100 w-100'>
                        <i className="pr1 fa fa-plus" aria-hidden="true"/>
                        Add Your First Profile
                        <i className="pl1 fa fa-plus" aria-hidden="true"/>
                    </button>
                </Link>
            </div>
        )
    }
}

export default CreateSocialProfileLink