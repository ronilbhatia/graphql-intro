const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;

// import all models in
const mongoose = require('mongoose');
const God = mongoose.model('god');
const Emblem = mongoose.model('emblem');
const Abode = mongoose.model('abode');

// import all GraphQL Types in.
const GodType = require('./god_type');
const EmblemType = require('./emblem_type');
const AbodeType = require('./abode_type');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    gods: {
      type: new GraphQLList(GodType),
      resolve() {
        return God.find({});
      }
    },
    god: {
      type: GodType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, { id }) {
        return God.findById(id);
      }
    },
    emblems: {
      type: new GraphQLList(EmblemType),
      resolve() {
        return Emblem.find({});
      }
    },
    emblem: {
      type: EmblemType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, { id }) {
        return Emblem.findById(id);
      }
    },
    abodes: {
      type: new GraphQLList(AbodeType),
      resolve() {
        return Abode.find({});
      }
    },
    abode: {
      type: AbodeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, { id }) {
        return Abode.findById(id);
      }
    }
  })
});

module.exports = RootQuery;