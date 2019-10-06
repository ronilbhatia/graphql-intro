const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } = graphql;

const mongoose = require('mongoose');
const God = mongoose.model('god');
const GodType = require('./god_type');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    newGod: {
      // specify the type we are mutating
      type: GodType,
      args: {
        // arguments required for this mutation
        name: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(_, { name, type, description }) {
        return God.create({ name, type, description })
      }
    },
    deleteGod: {
      type: GodType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(_, { id }) {
        return God.findByIdAndDelete(id)
      }
    },
    updateGod: {
      type: GodType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        type: { type: GraphQLString },
        description: { type: GraphQLString }
      },
      resolve(_, { id, name, type, description }) {
        const updateObj = {}
        if (name) updateObj.name = name;
        if (type) updateObj.type = type;
        if (description) updateObj.description = description;
        return God.findByIdAndUpdate(id, updateObj, { new: true });
      }
    },
    addGodRelative: {
      type: GodType,
      args: {
        godId: { type: GraphQLID },
        relativeId: { type: GraphQLID },
        relationship: { type: GraphQLString }
      },
      resolve(_, { godId, relativeId, relationship }) {
        return God.addRelative(godId, relativeId, relationship);
      }
    }
  }
});

module.exports = mutation;