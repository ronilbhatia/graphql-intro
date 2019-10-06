const graphql = require('graphql');
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList } = graphql;

const mongoose = require('mongoose');
const Abode = mongoose.model('abode');

const AbodeType = new GraphQLObjectType({
  name: 'AbodeType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    coordinates: { type: GraphQLString },
    gods: {
      type: new GraphQLList(require('./god_type')),
      resolve({ id }) {
        return Abode.findById(id)
          .populate('gods')
          .then(abode => abode.gods)
      }
    }
  })
});

module.exports = AbodeType;