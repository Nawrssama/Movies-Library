'use strict';

const express = require('express');
const cors = require('cors');
const server = express();
const axios = require('axios');
const data = require('./movie_data/data.json');
require("dotenv").config();
const pg = require('pg');

server.use(cors());
server.use(express.json());

const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL);



//construcrtor
function Movie(title, poster_path, overview) {
    this.title = title
    this.poster_path = poster_path
    this.overview = overview
}

function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}


server.get('/', homeHandler);

server.get('/favorite', favoriteHandler);

server.get('/trending', trendingHandler);

server.get("/search", searchHandler);

server.get("/similerMovies", moviesHandler);

server.get("/person", personHandler);

server.get('/mymovies', getmymoviesHandler);

server.get('/mymovies/:id', getmymoviesidHandler);

server.post('/mymovies', addmymoviesHandler);

server.delete('/mymovies/:id', deletemymovie);

server.put('/mymovies/:id', updatemymovie);

server.get('*', defaultHandler);

server.use(errorHandler);

// http://localhost:3000
function homeHandler(req, res) {

    let newMovie = new Movie(
        data.title,
        data.poster_path,
        data.overview
    )
    res.status(200).send(newMovie);
}


// http://localhost:3000/favorite
function favoriteHandler(req, res) {
    let str = "Welcome to Favorite Page";
    console.log("Hi from favorite page");
    res.status(200).send(str);
}


//default route
function defaultHandler(req, res) {
    let notFound = "this page does not exist  =("
    res.status(404).send(notFound);
}


//trending route
function trendingHandler(req, res) {
    try {
        const ABIKEY = process.env.ABIkey;
        const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${ABIKEY}`;
        axios.get(url)
            .then((result) => {
                let mapResult = result.data.results.map((item) => {
                    let singleMovie = new Movies(item.id, item.title, item.release_date, item.poster_path, item.overview);
                    return singleMovie;
                })
                res.send(mapResult);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}


//search route
function searchHandler(req, res) {
    try {
        const ABIKEY = process.env.ABIkey;
        const url2 = `https://api.themoviedb.org/3/search/movie?api_key=${ABIKEY}&language=en-US&query=spider%20man&page=1`;
        axios.get(url2)
            .then((result2) => {
                let mapResult2 = result2.data.results;
                res.send(mapResult2);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}


//get similer movies
function moviesHandler(req, res) {
    try {
        const ABIKEY = process.env.ABIkey;
        const url3 = `https://api.themoviedb.org/3/movie/155/similar?api_key=${ABIKEY}&language=en-US&page=1`;
        axios.get(url3)
            .then((result3) => {
                let movies = result3.data;
                res.send(movies);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

function personHandler(req, res) {
    try {
        const ABIKEY = process.env.ABIkey;
        const url4 = `https://api.themoviedb.org/3/person/3894?api_key=${ABIKEY}&language=en-US`;
        axios.get(url4)
            .then((result4) => {
                let person = result4.data;
                res.send(person);
            })
            .catch((error) => {
                res.status(500).send(error);
            })
    }
    catch (error) {
        errorHandler(error, req, res);
    }
}

function getmymoviesHandler(req, res) {
    // return all my movies (mymovies table content)
    const id = req.params.id;
    const sql = `SELECT * FROM mymovies`;
    client.query(sql)
    .then((data)=>{
        res.send(data.rows);
    })
    .catch((error)=>{
        errorHandler(error, req, res);
    })
}


function getmymoviesidHandler(req, res) {
    // return all my movies (mymovies table content)
    const id = req.params.id;
    const sql = `SELECT * FROM mymovies WHERE id=${id} `;
    client.query(sql)
    .then((data)=>{
        res.send(data.rows);
    })
    .catch((error)=>{
        errorHandler(error, req, res);
    })
}

function addmymoviesHandler(req,res) {
    const movie = req.body;
    const sql = `INSERT INTO mymovies (movie_name, movie_time, releas_date, overview, main_language, recomanded_age)
    VALUES ('${movie.movie_name}', '${movie.movie_time}', '${movie.releas_date}', '${movie.overview}', '${movie.main_language}', '${movie.recomanded_age}') RETURNING *;`;
    client.query(sql)
    .then((data)=>{
        res.send(data.rows);
    })
    .catch((error)=>{
        errorHandler(error,req,res);
    })
}

function deletemymovie(req,res) {
    const id = req.params.id;
    const sql = `DELETE FROM mymovies WHERE id=${id}`;
    client.query(sql)
    .then((data)=>{
        res.status(204).json({});
    })
    .catch((err)=>{
        errorHandler(err,req,res);
    })
}

function updatemymovie(req,res) {
    const id = req.params.id;
    const sql = `UPDATE mymovies SET movie_name=$1, movie_time=$2, releas_date=$3, overview=$4, main_language=$5, recomanded_age=$6 WHERE id=${id} RETURNING *`;
    const values = [req.body.movie_name,req.body.movie_time,req.body.releas_date,req.body.overview,req.body.main_language,req.body.recomanded_age];
    client.query(sql,values)
    .then((data)=>{
        res.status(200).send(data.rows);
    })
    .catch((err)=>{
        errorHandler(err,req,res);
    })
}


// midlleware functions 
function errorHandler(error, req, res) {
    const err = {
        status: 500,
        massage: error
    }
    res.status(500).send(err);
}

client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT} : I am ready`);
        });

    })

//for checking the code on terminal 

