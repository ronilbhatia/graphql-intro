const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLNonNull, GraphQLID } = graphql;

const mongoose = require('mongoose');
const User = mongoose.model('user');
const Post = mongoose.model('post');

const UserType = require('./user_type');
const PostType = require('./post_type');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    // query for all users
    users: {
      // Wrap our UserType in a `GraphQLList` so that we get them in an array
      type: new GraphQLList(UserType),
      // Must specify a resolve function to tell GraphQL how to access the data.
      // Even if there are many fields present on a given user, only the types
      // we specified on the User type will be returned.
      resolve() {
        // This is just a Mongoose method
        return User.find({});
      }
    },
    // query for a single user
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return User.findById(id)
      }
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve() {
        return Post.find({})
      }
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Post.findById(id)
      }
    }
  }
});

module.exports = RootQuery;