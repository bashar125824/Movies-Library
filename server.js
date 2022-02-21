'use strict'

const express = require("express");

const movies = require("./MovieData/data.json");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

const MYAPIKEY = process.env.MYAPIKEY;
const PORT = process.env.PORT;

function Movie(id, title, release_date, poster_path, overview) {

    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;

};

app.get('/', homeHandler);

app.get('/favorite', favoriteHandler);

app.get('/trending', trendingHandler);

app.get('/search', searchHandler);

app.get('/review', reviewHandler);

app.get('/tv', tvHandler);

app.use("*", notFoundHandler);

app.use(errorHandler);



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



function tvHandler(req, res) {
    let tvId = req.query.id;

    let result = [];

    axios.get(`https://api.themoviedb.org/3/tv/{${tvId}}?api_key=${MYAPIKEY}&language=en-US`)
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






app.listen(PORT, () => {
    console.log(`Listen on ${PORT}`);
});

