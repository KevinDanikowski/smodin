const axios = require('axios');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

/****** Mongoose Schemas ******/
const SOCIALPOSTINQUE = require('./socialPostInQue');

/******* Types *******/
const SocialPostInQueType = new GraphQLObjectType({
    name:'SocialPostInQue',
    fields:() => ({
        id: {type:GraphQLID},
        userId: {type:GraphQLID},
        socialPost: {
            id: {type:GraphQLID},
            message: {type:GraphQLString},
            image: {
                url: {type:GraphQLString}
            }
        },
        schedule: {
            month: {type:GraphQLString},
            date: {type:GraphQLInt},
            hour: {type:GraphQLString},
            minute: {type:GraphQLString}
        }
    })
});

/****** functions ******/
const socialPostInQueList = () => {
    return new Promise((resolve, reject) => {
        SOCIALPOSTINQUE.find((err, socialPostsInQue) => {
            if (err) reject(err)
            else resolve(socialPostsInQue)
        })
    })
};

/****** Root Query *****/
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        socialPostInQue: {
            type: SocialPostInQueType,
            args: {
                id: {type:GraphQLID}
            },
            resolve (parentValue, {id}) {
                return SOCIALPOSTINQUE.findById(id)
            }
        },
        socialPostsInQue:{
            type: new GraphQLList (SocialPostInQueType),
            resolve (parentValue, args) {
                return socialPostInQueList()
            }
        }
    }
})

// mutations
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addSocialPostInQue:{
            type: SocialPostInQueType,
            args:{
                userId: {type: new GraphQLNonNull (GraphQLID)},
                socialPost: {
                    id: {type: new GraphQLNonNull (GraphQLID)},
                    message: {type: new GraphQLNonNull (GraphQLString)},
                    image: {
                        url: {type: new GraphQLString}
                    }
                },
                schedule: {
                    month: {type: new GraphQLNonNull (GraphQLString)},
                    date: {type: new GraphQLNonNull (GraphQLInt)},
                    hour: {type: new GraphQLNonNull (GraphQLString)},
                    minute: {type: new GraphQLNonNull (GraphQLString)}
                }
            },
            resolve(parentValue, args){
                let newSocialPostInQue = new SOCIALPOSTINQUE({
                    name: args.name,
                    email: args.email,
                    age: args.age,
                    userId: args.userId,
                    socialPost: {
                        id: args.socialPost.id,
                        message: args.socialPost.message,
                        image: {
                            url: args.socialPost.image.url
                        }
                    },
                    schedule: {
                        month: args.schedule.month,
                        date: args.schedule.date,
                        hour: args.schedule.hour,
                        minute: args.schedule.minute
                    }
                });
                return new Promise((resolve, reject) => {
                    newSocialPostInQue.save(function (err) {
                        if(err) reject(err)
                        else resolve(newSocialPostInQue)
                    })
                    console.log ("New Social Post In Que Added")
                });
            }
        },
        deleteSocialPostInQue:{
            type: SocialPostInQueType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parentValue, args){
                return new Promise((resolve, reject) => {
                    CUSTOMER.remove({_id: args.id}, (err, customer) => {
                        if(err) reject(err)
                        else resolve()
                    });
                    console.log ("Customer Deleted")
                });
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});