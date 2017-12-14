import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo'
import { SubscriptionClient  } from 'subscriptions-transport-ws' // addGraphQLSubscriptions deprecated in newer versions
import { addGraphQLSubscriptions } from 'add-graphql-subscriptions'
import { GC_AUTH_TOKEN } from './constants'

const networkInterface = createNetworkInterface({
    uri: 'https://api.graph.cool/simple/v1/cj8adz6qz09jy0105s1gkdpoy'
})
const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/cj8adz6qz09jy0105s1gkdpoy', {
    reconnect: true,
    connectionParams: {
        authToken: localStorage.getItem(GC_AUTH_TOKEN),
    }
})
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient
)
networkInterface.use([{
    applyMiddleware(req, next) {
        if (!req.options.headers) {
            req.options.headers = {}
        }
        const token = localStorage.getItem(GC_AUTH_TOKEN)
        req.options.headers.authorization = token ? `Bearer ${token}` : null
        next()
    }
}])
const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions
})
ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </BrowserRouter>
    , document.getElementById('root')
)
registerServiceWorker();
