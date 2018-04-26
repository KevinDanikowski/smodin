require('../config/env'); //gets from paths.js called from env.js file

const ENV_FILE = {
    appPort: process.env.APP_PORT,
    graphcoolProjectId: process.env.GRAPHCOOL_PROJECT_ID,
    scheduledPostsApiUrl: process.env.SCHEDULED_POSTS_API_URL
}

module.exports = ENV_FILE