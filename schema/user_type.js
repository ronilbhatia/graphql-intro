const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

const mongoose = require('mongoose');
const User = mongoose.model('user');

const UserType = new GraphQLObjectType({
  // capitalize!
  name: 'UserType',
  // fields refers to everything this Type will be able to return to you, which
  // means all of the data associated with this type in the database.
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
      type: new GraphQLList(require('./post_type')),
      resolve(parentValue) {
        return (
          User.findById(parentValue.id)
            .populate("posts")
            .then(user => user.posts)
        )
      }
    }
  })
});

module.exports = UserType;