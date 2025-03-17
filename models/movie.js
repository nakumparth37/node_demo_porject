const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const movieSchema = new mongoose.Schema(
  {
    movieID: { type: Number, unique: true },
    title: { type: String, required: true, unique: true },
    plot: { type: String, required: true },
    poster: {
      type: String,
      default: "movieDefault.webp",
    },
    rated: String,
    released: { type: Date, required: true },
    runtime: { type: Number, required: true },
    genres: { type: [String], required: true },
    cast: { type: [String], required: true },
    countries: { type: [String], required: true },
    directors: { type: [String], required: true },
    writers: { type: [String], required: true },
    awards: {
      nominations: Number,
      text: String,
      wins: Number,
    },
    fullplot: String,
    imdb: {
      id: { type: Number, required: true },
      rating: { type: Number, required: true },
      votes: { type: Number, required: true },
    },
    languages: { type: [String], required: true, default : ['English'] },
    lastupdated: String,
    metacritic: Number,
    num_mflix_comments: Number,
    tomatoes: {
      viewer: {
        rating: Number,
        numReviews: Number,
        meter: Number,
      },
      lastUpdated: Date,
    },
    type: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { timeseries: true }
);
movieSchema.plugin(AutoIncrement, { inc_field: "movieID" });
const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
