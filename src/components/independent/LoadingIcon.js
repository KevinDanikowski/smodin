import React from 'react'
import CircularProgress from 'material-ui/CircularProgress';

const LoadingIcon = () => {
    return(
        <div className='w-100 h-100 flex justify-center items-center'>
            <CircularProgress color={'#512DA8'} thickness={5} size={100}/>
        </div>
    )
}
export default LoadingIcon