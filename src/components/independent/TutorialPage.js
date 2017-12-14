import React, { Component } from 'react'

class TutorialPage extends Component {
    render() {
        return (
            <div className='w-80'>
                <h1 className=' tc mb2 mt2 dark-gray'>Tutorial Page</h1>
                <h2 className=' tc mb2 mt2 dark-gray'>Tutorial Under Construction</h2>
                <h2 className=' tc mb2 mt2 dark-gray'>Quick Notes:</h2>
                <div>
                    <li className=' mb1 mt1 dark-gray'>1. Connect IFTTT to Your Facebook</li>
                    <li className=' mb1 mt1 dark-gray'>2. Login to Your Console to Webhook</li>
                    <li className=' mb1 mt1 dark-gray'>3. Create Your Social Posts</li>
                    <li className=' mb1 mt1 dark-gray'>4. Define the Schedule</li>
                    <li className=' mb1 mt1 dark-gray'>5. Hit Start</li>
                </div>
            </div>
        )
    }

}
export default TutorialPage