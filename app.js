const express = require('express')
const app = express()
const port = (parseInt(process.env.PORT || '3000', 10))
const level = require('level')
const dbMovies = level('./db', {valueEncoding: 'json'})
const dbLists = level('./dbLists', {valueEncoding: 'json'})
const connectLivereload = require("connect-livereload");

app.use(express.json())
app.use(express.static('public'))
app.use(connectLivereload());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080/");
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/legumes', (req, res) => {
    res.sendFile(__dirname + '/legumes.html')
})

app.get('/users/:userId', function (req, res) {
    console.log(req.params)
    res.sendFile(__dirname + '/legumes.html')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

//Routes des movies
//Ajouter un movie
app.post('/movies', async (req, res) => {
    let objetFilm = req.body
    if (objetFilm.movie_id === undefined) {
        res.status(400).json("Merci de renseigner un id").end()
    } else if (Number.isInteger(objetFilm.movie_id) === false) {
        res.status(400).json("Merci de saisir un entier comme id").end()
        // } else if (typeof (dbMovies.get(objetFilm.movie_id)) !== undefined) {
        //     res.status(400).json("cette id est deja utilisé").end()
    } else {
        await dbMovies.put(objetFilm.movie_id, objetFilm)
        console.log(objetFilm.movie_id + objetFilm)
        res.status(200).json(objetFilm)
    }
})

//display a movie
app.get('/movies/:movie_id', async (req, res) => {
    try {
        let movie = await dbMovies.get(parseInt(req.params.movie_id))
        console.log(movie)
        res.status(200).json(movie)
    } catch (err) {
        res.status(404).end()
    }
})

//update a movie
app.put('/movies/:movie_id', async (req, res) => {
    if (parseInt(req.params.movie_id) !== parseInt(req.body.movie_id)) {
        res.status(400).json("l'id ne peut être modifié")
    }
    await dbMovies.put(req.params.movie_id, req.body)
    res.status(200).json(req.body)
})

//delete a movie
app.delete('/movies/:movie_id', async (req, res) => {
    await dbMovies.del(req.params.movie_id)
    res.status(200).json("Suprimmé!!!!")
})


//routes des listes
//ajoute une liste
app.post('/listes', async (req, res) => {
    // let filmListe = req.body
    // let test=dbLists.get(filmListe.list_id,function(err,value){
    //     if(err){
    //         return "undefined"
    //     }else {
    //         return "object"
    //     }
    // })
    if (filmListe.list_id === undefined) {
        res.status(400).json("Merci de renseigner un id").end()
    // } else if ( test === 'object') {
    //     res.status(400).json("cet id est deja utilisé").end()
    } else if (Number.isInteger(filmListe.list_id) === false) {
        res.status(400).json("Merci de saisir un entier comme id").end()
    } else if (Array.isArray(req.body.moviesList) === false) {
        res.status(400).json("La liste doit être dans un tableau").end()
    } else {
        await dbLists.put(filmListe.list_id, filmListe)
        console.log(filmListe.list_id + filmListe)
        res.status(200).json(filmListe)
    }
})

//display a list
app.get('/listes/:list_id', async (req, res) => {
    try {
        let liste = await dbLists.get(req.params.list_id)
        console.log(liste)
        res.status(200).json(liste)
    } catch (err) {
        res.status(404).end()
    }
})

//update a list
app.put('/listes/:list_id', async (req, res) => {
    if (parseInt(req.params.list_id) !== parseInt(req.body.list_id)) {
        res.status(400).json("l'id ne peut être modifié").end()
    } else {
        await dbLists.put(req.params.list_id, req.body)
        res.status(200).json(req.body)
    }
})

//delete a list
app.delete('/listes/:list_id', async (req, res) => {
    await dbLists.del(req.params.list_id)
    res.status(200).json("Suprimmé!!!!")
})

// add a movie to a list
app.post('/listes/:list_id/movies_list', async (req, res) => {
    try {
        let liste = await dbLists.get(req.params.list_id)
        liste.films.push(req.body.film_id)
        dbLists.put(req.params.list_id, liste)
        console.log(liste)
        res.status(200).json(liste)
    } catch (err) {
        res.status(404).end()
    }
})

//delete a movie to a list
app.delete('/listes/:list_id/movies_list/:film_id', async (req, res) => {
    try {
        let liste = await dbLists.get(req.params.list_id)
        let index = liste.films.indexOf(parseInt(req.params.film_id))
        liste.films.splice(index, 1)
        dbLists.put(req.params.list_id, liste)
        console.log(liste)
        res.status(200).json(liste)
    } catch (err) {
        res.status(404).end()
    }
})