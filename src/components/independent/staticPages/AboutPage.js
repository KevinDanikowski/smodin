import React from 'react'
import FontAwesome from 'react-fontawesome'

export default (props) =>
    <React.Fragment>
        <h1>About Smodin</h1>
        <div className='about flex justify-between'>
            <div onClick={() => window.open('https://www.linkedin.com/in/kevin-danikowski')} className='card flex flex-column items-center'>
                <FontAwesome name='linkedin-square' size='lg'/>
                <p>About Me</p>
            </div>
            <div onClick={() => window.open('https://github.com/KevinDanikowski/smodin')} className='card flex flex-column items-center'>
                <FontAwesome name='github-square' size='lg'/>
                <p>Source Code</p>
            </div>
            <div onClick={() => window.open('https://github.com/KevinDanikowski')} className='card flex flex-column items-center'>
                <FontAwesome name='github-square' size='lg'/>
                <p>My Github</p>
            </div>
            <div onClick={() => window.open('http://ota.ai')} className='card flex flex-column items-center'>
                <FontAwesome name='copyright' size='lg'/>
                <p>Copyright</p>
            </div>
        </div>
    </React.Fragment>
