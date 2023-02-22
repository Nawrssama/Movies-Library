'use strict';

//import the express framework
const express = require('express');
//import cors
const cors = require('cors');
const { get } = require('express/lib/response');

const server = express();

//server open for all clients requests
server.use(cors());

const PORT = 3000;

function Movie(title, poster_path, overview){
    this.title = title
    this.poster_path = poster_path
    this.overview = overview
}


server.get('/',(req,res)=>{
    let data = require('./movie_data/data.json');

    let newMovie = new Movie(
        data.title , data.poster_path , data.overview
    )
    res.status(200).send(newMovie);
})



// http://localhost:3000/favorite
server.get('/favorite',(req,res)=>{
    let str = "Welcome to Favorite Page";
    console.log("Hi from favorite page");
    res.status(200).send(str);
})

//default route
server.get('*',(req,res)=>{
    let notFound = "this page does not exist  =("
    res.status(404).send(notFound);
})

server.get('*',(req,res) =>{
    let serverEr = "sorry.........internet server error"
    res.status(500).send(serverEr);
})

server.listen(PORT, () =>{
    console.log(`listening on ${PORT} : I am ready`);
})

