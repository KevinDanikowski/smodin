import React from 'react'
import CircularProgress from 'material-ui/CircularProgress';

const ErrorIcon = () => {
    return(
        <div className='w-100 h-100 flex justify-center items-center'>
            <CircularProgress color={'red'} thickness={5} size={100}/>
        </div>
    )
}
export default ErrorIcon