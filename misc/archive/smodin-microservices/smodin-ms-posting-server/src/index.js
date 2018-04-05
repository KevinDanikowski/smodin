import React from 'react';
import ReactDOM from 'react-dom';
import {
    ApolloClient,
    createNetworkInterface,
    ApolloProvider,
} from 'react-apollo';
import App from './App';


const networkInterface = createNetworkInterface({
    uri: 'http://localhost:3001/graphql'
});
const client = new ApolloClient({
    networkInterface: networkInterface,
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);