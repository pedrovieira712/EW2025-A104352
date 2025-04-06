var mongoose = require('mongoose');

var livroSchema = new mongoose.Schema({
  _id: Number,   
  bookId: String,
  title: String,
  series: String,
  author: [String],
  rating: Number,
  description: String,
  language: String,
  isbn: String,
  genres: [String],
  characters: [String],
  bookFormat: String,
  edition: String,
  pages: String, 
  publisher: String,
  publishDate: String,
  firstPublishDate: String,
  awards: [String],
  numRatings: Number,
  ratingsByStars: [String ],
  likedPercent: String,  
  setting: [String],
  coverImg: String,
  bbeScore: Number,
  bbeVotes:  Number,
  price: Number
}, { versionKey: false });

module.exports = mongoose.model('livro', livroSchema);
