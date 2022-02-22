'use strict'

const express = require("express");

const movies = require("./MovieData/data.json");
const dotenv = require("dotenv");
const axios = require("axios");
const pg = require("pg");

dotenv.config();

const app = express();

const MYAPIKEY = process.env.MYAPIKEY;
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

const client = new pg.Client(DATABASE_URL);

function Movie(id, title, release_date, poster_path, overview) {

    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;

};

app.use(express.json());

app.get('/', homeHandler);

app.get('/favorite', favoriteHandler);

app.get('/trending', trendingHandler);

app.get('/search', searchHandler);

app.get('/review', reviewHandler);

app.get('/watch', watchHandler);

app.get('/addMovie', addMovieHandler);

app.get('/getMovie', getMovieHandler);

app.use("*", notFoundHandler);

app.use(errorHandler);


function addMovieHandler(req, res) {
    const movie = req.body;
    console.log(movie);
    const sql = `INSERT INTO movieTable(title, release_date, poster_path , overview) VALUES($1, $2, $3, $4) RETURNING *`
    const values = [movie.title, movie.release_date, movie.poster_path, movie.overview]
    client.query(sql, values).then((result) => {
        return res.status(201).json(result.rows);
    })


};

function getMovieHandler(req, res) {
    const sql = `SELECT * FROM movieTable`;

    client.query(sql).then((result) => {
        return res.status(200).json(result.rows);
    }).catch((error) => {
        errorHandler(error, req, res);
    });
};

function trendingHandler(req, res) {

    let result = [];

    axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${MYAPIKEY}&language=en-US`)
        .then(apiResponse => {
            apiResponse.data.results.map(value => {
                let theMovie = new Movie(value.id, value.title, value.release_date, value.poster_path, value.overview);
                result.push(theMovie);
            })
            return res.status(200).json(result);
        }).catch(error => {
            errorHandler(error, req, res);
        })



};

function searchHandler(request, response) {
    const searching = request.query.original_title;
    let arr = [];
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${MYAPIKEY}&language=en-US&query=${searching}&page=2`)
        .then(apiResponse => {
            // console.log(apiResponse);
            apiResponse.data.results.map(value => {
                let theMovie = value.results;
                result.push(theMovie);
            })
            return response.status(200).json(arr);
        }).catch(error => {
            errorHandler(error, request, response);
        })


}

function reviewHandler(req, res) {
    let reviewId = req.query.id;

    let result = [];

    axios.get(`https://api.themoviedb.org/3/review/${reviewId}?api_key=${MYAPIKEY}`)
        .then(apiResponse => {
            apiResponse.data.results.map(value => {
                let theMovie = new Movie(value.id, value.title, value.release_date, value.poster_path, value.overview);
                result.push(theMovie);
            })
            return res.status(200).json(result);
        }).catch(error => {
            errorHandler(error, req, res);
        })



};



function watchHandler(req, res) {

    let result = [];

    axios.get(`https://api.themoviedb.org/3/watch/providers/regions?api_key=${MYAPIKEY}&language=en-US`)
        .then(apiResponse => {
            apiResponse.data.results.map(value => {
                let theMovie = new Movie(value.iso_3166_1, value.english_name);
                result.push(theMovie);
            })
            return res.status(200).json(result);
        }).catch(error => {
            errorHandler(error, req, res);

        })

};





function homeHandler(request, response) {



    let Summary = new Movie(data.title, data.poster_path, data.overview);


    return response.status(200).json(Summary);

}

function favoriteHandler(req, res) {

    return res.send("Welcome to Favorite Page");

}



function errorHandler(error, requesting, responsing) {
    const err = {
        status: 500,
        message: error
    }
    return responsing.status(500).send(err);
}

function notFoundHandler(requesting, responsing) {
    return responsing.status(404).send("Not Found");
}




client.connect();

app.listen(PORT, () => {
    console.log(`Listen on ${PORT}`);
});

