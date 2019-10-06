const graphql = require('graphql');
const { GraphQLID, GraphQLString, GraphQLObjectType, GraphQLList } = graphql;

const mongoose = require('mongoose');
const God = mongoose.model('god');
const Abode = mongoose.model('abode');

const GodType = new GraphQLObjectType({
  name: 'GodType',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    description: { type: GraphQLString },
    domains: { type: new GraphQLList(GraphQLString) },
    abode: {
      type: require('./abode_type'),
      resolve({ abode }) {
        return Abode.findById(abode)
          .then(abode => abode)
          .catch(err => null)
      }
    },
    emblems: {
      type: new GraphQLList(require('./emblem_type')),
      resolve({ id }) {
        return God.findById(id)
          .populate('emblems')
          .then(god => god.emblems)
      }
    },
    parents: {
      type: new GraphQLList(GodType),
      resolve({ id }) {
        return God.findRelatives(id, 'parents')
      }
    },
    children: {
      type: new GraphQLList(GodType),
      resolve({ id }) {
        return God.findRelatives(id, 'children')
      }
    },
    siblings: {
      type: new GraphQLList(GodType),
      resolve({ id }) {
        return God.findRelatives(id, 'siblings')
      }
    }
  })
});

module.exports = GodType;