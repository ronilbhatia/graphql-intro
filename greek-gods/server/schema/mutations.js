const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } = graphql;

const mongoose = require('mongoose');
const God = mongoose.model('god');
const Emblem = mongoose.model('emblem');
const Abode = mongoose.model('abode');

const GodType = require('./god_type');
const EmblemType = require('./emblem_type');
const AbodeType = require('./abode_type');

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
    },
    removeGodRelative: {
      type: GodType,
      args: {
        godId: { type: GraphQLID },
        relativeId: { type: GraphQLID },
        relationship: { type: GraphQLString }
      },
      resolve(_, { godId, relativeId, relationship }) {
        return God.removeRelative(godId, relativeId, relationship);
      }
    },
    addGodEmblem: {
      type: GodType,
      args: {
        godId: { type: GraphQLID },
        emblemId: { type: GraphQLID }
      },
      resolve(_, { godId, emblemId }) {
        const godPromise = God.findById(godId).then(god => {
          god.emblems.push(emblemId);
          return god.save();
        });
        const emblemPromise = Emblem.findById(emblemId).then(emblem => {
          emblem.gods.push(godId);
          return emblem.save()
        });

        return Promise.all([godPromise, emblemPromise])
          .then(([god, emblem]) => god)
      }
    },
    removeGodEmblem: {
      type: GodType,
      args: {
        godId: { type: GraphQLID },
        emblemId: { type: GraphQLID }
      },
      resolve(_, { godId, emblemId }) {
        const godPromise = God.findById(godId).then(god => {
          god.emblems.pull(emblemId);
          return god.save();
        });

        const emblemPromise = Emblem.findById(emblemId).then(emblem => {
          emblem.gods.pull(godId)
          return emblem.save();
        });

        return Promise.all([godPromise, emblemPromise])
          .then(([god, emblem]) => god)
      }
    },
    updateGodAbode: {
      type: GodType,
      args: {
        godId: { type: GraphQLID },
        abodeId: { type: GraphQLID }
      },
      resolve(_, { godId, abodeId }) {
        return God.findOneAndUpdate(
          { _id: godId },
          { $set: { abode: abodeId } },
          { new: true }
        )
      }
    }
  }
});

module.exports = mutation;