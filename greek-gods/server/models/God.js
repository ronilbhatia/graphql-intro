const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GodSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  domains: [{
    type: String
  }],
  abode: {
    type: Schema.Types.ObjectId,
    ref: "abode"
  },
  emblems: [{
    type: Schema.Types.ObjectId,
    ref: "emblem"
  }],
  parents: [{
    type: Schema.Types.ObjectId,
    ref: "god"
  }],
  children: [{
    type: Schema.Types.ObjectId,
    ref: "god"
  }],
  siblings: [{
    type: Schema.Types.ObjectId,
    ref: "god"
  }]
});

GodSchema.statics.findRelatives = function (godId, type) {
  return this.findById(godId)
    .populate(type)
    .then(god => god[type])
}

GodSchema.statics.addRelative = function (godId, relativeId, relationship) {
  return this.find({ _id: { $in: [godId, relativeId] } })
    .then(gods => {
      const god = godId === gods[0].id ? gods[0] : gods[1];
      const relative = relativeId === gods[0].id ? gods[0] : gods[1];

      switch (relationship) {
        case 'parent':
          god.parents.push(relative);
          relative.children.push(god);
          break;
        case 'child':
          god.children.push(relative);
          relative.parents.push(god);
        case 'sibling':
          god.siblings.push(relative);
          relative.siblings.push(god);
        default:
          break;
      }

      return Promise.all([god.save(), relative.save()])
        .then(([god, relative]) => god);
    })
}

GodSchema.statics.removeRelative = function (godId, relativeId, relationship) {
  return this.find({ _id: { $in: [godId, relativeId] } })
    .then(gods => {
      const god = godId === gods[0].id ? gods[0] : gods[1];
      const relative = relativeId === gods[0].id ? gods[0] : gods[1];

      let godSpliceIdx, relativeSpliceIdx;
      switch (relationship) {
        case 'parent':
          godSpliceIdx = god.parents.indexOf(relative.id);
          relativeSpliceIdx = relative.children.indexOf(god.id);
          if (godSpliceIdx !== -1) god.parents.splice(godSpliceIdx, 1);
          if (relativeSpliceIdx !== -1) relative.children.splice(relativeSpliceIdx, 1);
          break;
        case 'child':
          godSpliceIdx = god.children.indexOf(relative.id);
          relativeSpliceIdx = relative.parents.indexOf(god.id);
          if (godSpliceIdx !== -1) god.children.splice(godSpliceIdx, 1);
          if (relativeSpliceIdx !== -1) relative.parents.splice(relativeSpliceIdx, 1);
          break;
        case 'sibling':
          godSpliceIdx = god.siblings.indexOf(relative.id);
          relativeSpliceIdx = relative.siblings.indexOf(god.id);
          if (godSpliceIdx !== -1) god.siblings.splice(godSpliceIdx, 1);
          if (relativeSpliceIdx !== -1) relative.siblings.splice(relativeSpliceIdx, 1);
          break;
      }

      return Promise.all([god.save(), relative.save()])
        .then(([god, relative]) => god)
    })
}

module.exports = mongoose.model("god", GodSchema);