import React from 'react'
import { Link } from 'react-router-dom'

export default (props) =>
    <div className='flex justify-center items-center'>
        <Link to='/create-profile' className=''>
            <button className='h-100 w-100'>
                <i className="pr1 fa fa-plus" aria-hidden="true"/>
                Add Your First Profile
                <i className="pl1 fa fa-plus" aria-hidden="true"/>
            </button>
        </Link>
    </div>