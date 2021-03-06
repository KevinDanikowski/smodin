import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'
import {ApolloProvider, createNetworkInterface, ApolloClient} from 'react-apollo'
import {SubscriptionClient} from 'subscriptions-transport-ws' // addGraphQLSubscriptions deprecated in newer versions
import {addGraphQLSubscriptions} from 'add-graphql-subscriptions'
import {GC_AUTH_TOKEN} from './constants'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'
import './scss/index.scss'
import './scss/npm.components.scss'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {deepPurple500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Provider } from "./Context"


const GRAPHCOOL_PROJECT_ID = process.env.GRAPHCOOL_PROJECT_ID
export const SCHEDULED_POSTS_API_URL = process.env.SCHEDULED_POSTS_API_URL

const cache = new InMemoryCache()
const defaultState = { }

const stateLink = withClientState({
    cache,
    defaults: defaultState,
    resolvers: { Mutation: { } }
})
const graphCoolUrl = 'https://api.graph.cool/simple/v1/' + GRAPHCOOL_PROJECT_ID
const networkInterface = createNetworkInterface({
    uri: graphCoolUrl
})
const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/' + GRAPHCOOL_PROJECT_ID, {
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

export const client = new ApolloClient({
    networkInterface: networkInterfaceWithSubscriptions,
    link: ApolloLink.from([
        stateLink,
        new HttpLink({ uri: graphCoolUrl })
    ]),
    cache
})
export const scheduledPostClient = new ApolloClient({
    link: new HttpLink({ uri: SCHEDULED_POSTS_API_URL || 'http://localhost:3200/graphql' })
})
const muiTheme = getMuiTheme({
    palette: {
        primary1Color: deepPurple500
    },
});


ReactDOM.render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <Provider>
            <BrowserRouter>
                <ApolloProvider client={client}>
                    <App/>
                </ApolloProvider>
            </BrowserRouter>
        </Provider>
    </MuiThemeProvider>
    , document.getElementById('root')
)
registerServiceWorker();
