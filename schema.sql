DROP TABLE IF EXISTS mymovies; 

CREATE TABLE IF NOT EXISTS mymovies (
    id SERIAL PRIMARY KEY,
    movie_name VARCHAR(255),
    movie_time VARCHAR(255),
    releas_date VARCHAR(255),
    overview VARCHAR(1000),
    main_language VARCHAR(255),
    recomanded_age INT
);