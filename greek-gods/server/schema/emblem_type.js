const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

const mongoose = require('mongoose');
const Emblem = mongoose.model('emblem');

const EmblemType = new GraphQLObjectType({
  name: 'EmblemType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    gods: {
      type: new GraphQLList(require('./god_type')),
      resolve({ id }) {
        return Emblem.findById(id)
          .populate('gods')
          .then(emblem => emblem.gods)
      }
    }
  })
});

module.exports = EmblemType;