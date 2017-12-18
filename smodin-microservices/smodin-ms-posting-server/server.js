'use strict';

const express = require('express');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { request } = require('graphql-request');
const { scheduleSocialPost } = require('./src/startSocialPostCronSchedule.utils')
const { GRAPH_COOL_API_URL } = require('./src/constants')

const schema = require('./model/Schema');
const cors = require('cors');

var app = express();
var router = express.Router();

var port = process.env.API_PORT || 3001;

//db config
var mongoDB = 'mongodb://otaai:OTAmlaauto684!@ds133104.mlab.com:33104/mernpostwriter';
mongoose.connect(mongoDB, { useMongoClient: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use('/graphql', cors(), expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.use(/\/((?!graphql).)*/, bodyParser.urlencoded({ extended: true }));
app.use(/\/((?!graphql).)*/, bodyParser.json());
app.use(bodyParser.text({ type: 'application/graphql' }));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use('/api', router);

router.get('/', function(req, res) {
    res.json({ message: 'API Initialized!'});
});

router.post('/schedule', function (req, res) {
    let socialPostsForQue = req.body
    let socialProfileId = req.body[0].socialProfileId
    request(GRAPH_COOL_API_URL, postingPlatformQuery, {socialProfileId: socialProfileId}).then(data => {
        const postingPlatform = data.PostingPlatform
    })
    //don't forget userId and profileId
    socialPostsForQue.map(socialPostAndSchedule => {
        const createSocialPostInQueMutationVariables = {

        }
        request(GRAPH_COOL_API_URL, createSocialPostInQueMutation, createSocialPostInQueMutationVariables).then(data => console.log(data))
        scheduleSocialPost(socialPostAndSchedule, postingPlatform, inQueId)
    })
})

app.listen(port, () => {
    console.log(`api running on port ${port}`);
});

const createSocialPostInQueMutation = `{
  addSocialPostInQueMutation(title: "Inception") {
    releaseDate
    actors {
      name
    }
  }
}`

const postingPlatformQuery = `{
query PostingPlatformQuery($socialProfileId: ID!) {
    PostingPlatform(socialProfileId: $socialProfileId) {
      id
      platform
      iftttUrl
      zapierUrl
    }
  }
}`
const socialPostWithSchedule = {
    socialPost: {
        id: '',
        message: '',
        image: {
            url: ''
        }
    },
    schedule: {
        month: '',
        date: 0,
        hour: '',
        minute: ''
    }
}

