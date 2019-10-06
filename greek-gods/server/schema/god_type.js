const graphql = require('graphql');
const { GraphQLID, GraphQLString, GraphQLObjectType, GraphQLList } = graphql;

const mongoose = require('mongoose');
const God = mongoose.model('god');

const GodType = new GraphQLObjectType({
  name: 'GodType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    description: { type: GraphQLString },
    domains: { type: new GraphQLList(GraphQLString) }
  })
});

module.exports = GodType;