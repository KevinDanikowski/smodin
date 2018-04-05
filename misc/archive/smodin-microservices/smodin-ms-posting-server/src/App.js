//App.js
import React, { Component } from 'react';
import ApiPage from './components/ApiPage'

class App extends Component {
     render(){
        return(
            <div>
                <ApiPage
                    url={'http://localhost:3001/api'}/>
            </div>
        )
    }
}
export default App;