import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

if(!process.env.MONGODB_URI) throw new Error('uri missing');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

var stageSchema = new Schema({
  location: {
    type: String,
  },
  artist: {
    type: String,
  },
  url: {
    type: String,
  }
})

var Stage = mongoose.model('Stage', stageSchema)
module.exports = {
  Stage : Stage,
};
