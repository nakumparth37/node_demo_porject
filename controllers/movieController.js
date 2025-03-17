
const Movie = require('../models/movie');
const _ = require('lodash');


const isMovieAlreadyExisted = async (movieTitle) => {
    const existingMovie = await Movie.findOne({ title: movieTitle });
    return existingMovie !== null;
};


// Create a Movie
exports.createMovie = async (req, res) => {
    try {
        const title = req.body.title;
        if (await isMovieAlreadyExisted(title)) {
            return res.status(400).json({ 
                status : false,
                message: `Movie ${title} is already existed`
            });
        }
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).json({ message: "Movie added successfully", movie });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Movies with Pagination & Filtering
exports.getAllMovies = async (req, res) => {
    try {
        const page = req.query.page && !isNaN(parseInt(req.query.page)) ? parseInt(req.query.page) : 1;
        const limit = req.query.limit && !isNaN(parseInt(req.query.limit)) ? parseInt(req.query.limit) : 10;
        const skip = (page - 1) * limit;

        let movies = await Movie.find()
        .skip(skip)
        .limit(limit);
        const totalMovies = await Movie.countDocuments();
        const totalPages = Math.ceil(totalMovies / limit);
        res.status(200).json({
            "totalMoviesCount" : totalMovies,
            "currentPage" : page,
            "limit": limit,
            'totalPages' : totalPages,
            "movies" : movies,

        });
    } catch (error) {
        res.status(500).json({error : error.message})
    }
};

exports.getMoviesByMovieId = async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findOne({ movieID : movieId });

        return res.status(200).json({
            status : true,
            movie : movie,
        })
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}


// Get All Movies with Pagination & Filtering
exports.getMovies = async (req, res) => {
    try {
        const {name, genre, year, director, rating, page = 1, limit = 10} = req.query;
        let filter = {} ;
        if (name) filter.title = new RegExp(name, 'i');
        if (genre) filter.genres = {$all : genre.split(',')};
        if (year) filter.year = parseInt(year);
        if (director) filter.directors = new RegExp(director);
        if (rating) filter['imdb.rating'] = {$gte : parseInt(rating)};

        const pageNumber = Math.max(1, parseInt(page));
        const itemInPage = Math.max(1,parseInt(limit));
        const skip = (pageNumber - 1) * itemInPage;

        let movies = await Movie.find(filter).select({
            title: 1, 
            year: 1, 
            genres: 1, 
            directors: 1, 
            'imdb.rating': 1,
        })
        .skip(skip)
        .limit(itemInPage);
        const totalMovies = await Movie.countDocuments(filter);
        const totalPages = Math.ceil(totalMovies / itemInPage);
        res.status(200).json({
            "fliteMovieCount" : totalMovies,
            "currentPage" : pageNumber,
            "limit": itemInPage,
            'totalPages' : totalPages,
            "movies" : movies,
        });
    } catch (error) {
        res.status(500).json({error : error.message})
    }
};


exports.updateMovie = async (req, res) => {
    try {
        const movieID = req.params.id;
        const updateMovieData = req.body;

        // Check if title already exists for another movie
        if (updateMovieData.title) {
            const existingMovie = await Movie.findOne({ title: updateMovieData.title });
            if (existingMovie && existingMovie.movieID !== movieID) {
                return res.status(400).json({
                    status: false,
                    message: `Movie with title '${updateMovieData.title}' already exists`
                });
            }
        }

        const existingMovie = await Movie.findOne({movieID : movieID});
        if (!existingMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const mergedData = _.merge(existingMovie.toObject(), updateMovieData);

        const updatedMovie = await Movie.findOneAndUpdate(
            {movieID : movieID},
            { $set: mergedData },
            { 
                new: true, 
                runValidators: true,
                context: 'query'
            }
        );

        return res.status(200).json({
            message: 'Movie updated successfully',
            movie: updatedMovie
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteMovie = async (req, res) => {
    try {
        const movieID = req.params.id
        const deletedMovie = await Movie.findOneAndDelete({movieID:movieID});
        if (!deletedMovie) {
            return res.status(404).json({ 
                status: false,
                message: "Movie not found" 
            });
        }

        return res.status(200).json({
            status: true,
            message: "Movie deleted successfully",
            deletedMovie : deletedMovie
        });
    } catch (error) {
        res.status(500).json({ error : error.message })
    }
}