DROP TABLE IF EXISTS mymovies; 

CREATE TABLE IF NOT EXISTS mymovies (
    id SERIAL PRIMARY KEY,
    title VARCHAR (255),
    release_date VARCHAR(255),
    overview VARCHAR(1000),
    poster_path VARCHAR(255),
    comment VARCHAR(100000)

);


