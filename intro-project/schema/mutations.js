const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } = graphql;
const mongoose = require('mongoose');
const UserType = require('./user_type');
const PostType = require('./post_type');

const User = mongoose.model('user');
const Post = mongoose.model('post');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // this will be the name of the mutation
    newUser: {
      // creating a User type
      type: UserType,
      args: {
        // args needed to make a new user
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { name, email, password }) {
        return new User({ name, email, password }).save();
      }
    },
    newPost: {
      // creating a Post type,
      type: PostType,
      args: {
        // args needed to make a new post
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: new GraphQLNonNull(GraphQLString) },
        date: { type: new GraphQLNonNull(GraphQLString) },
        author: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, { title, body, date, author }) {
        let thePost;
        return new Post({ title, body, date, author })
          .save()
          .then(post => {
            thePost = post;
            return User.findOneAndUpdate(
              { _id: post.author },
              { $push: { posts: post } },
              { "new": true },
            )
          })
          .then(() => thePost);
      }
    }
  }
});

module.exports = mutation;