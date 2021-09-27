const express = require('express')
const app = express()
const port = (parseInt(process.env.PORT || '3000', 10))
const level = require('level')
const db = level('./db', {valueEncoding: 'json'})

app.use(express.json())
app.use(express.static('public'))

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
    if (objetFilm.movie_id===undefined){
        res.status(400).json("Merci de renseigner un id")
    }
    await db.put(objetFilm.movie_id, objetFilm)
    console.log(objetFilm.movie_id + objetFilm)
    res.status(200).json(objetFilm)
})

//display a movie
app.get('/movies/:movie_id', async (req, res) => {
    try {
        let movie = await db.get(req.params.movie_id)
        console.log(movie)
        res.status(200).json(movie)
    } catch (err) {
        res.status(404).end()
    }
})

//update a movie
app.put('/movies/:movie_id', async (req, res) => {
    await db.put(req.params.movie_id, req.body)
    res.status(200).json(req.body)
})

//delete a movie
app.delete('/movies/:movie_id', async (req, res) => {
    await db.del(req.params.movie_id)
    res.status(200).json("Suprimmé!!!!")
})


//routes des listes
//ajoute une liste
app.post('/listes', async (req, res) => {
    let filmListe = req.body
    await db.put(filmListe.id_list, filmListe)
    console.log(filmListe.id_list + filmListe)
    res.status(200).json(filmListe)
})

//display a list
app.get('/listes/:list_id', async (req, res) => {
    try {
        let liste = await db.get(req.params.list_id)
        console.log(liste)
        res.status(200).json(liste)
    } catch (err) {
        res.status(404).end()
    }
})

//update a list
app.put('/listes/:list_id', async (req, res) => {
    await db.put(req.params.list_id, req.body)
    res.status(200).json(req.body)
})

//delete a list
app.delete('/listes/:list_id', async (req, res) => {
    await db.del(req.params.list_id)
    res.status(200).json("Suprimmé!!!!")
})

// add a movie to a list
app.post('/listes/:list_id/movies_list', async (req, res) => {
    try {
        let liste = await db.get(req.params.list_id)
        liste.films.push(req.body.film_id)
        db.put(req.params.list_id, liste)
        console.log(liste)
        res.status(200).json(liste)
    } catch (err) {
        res.status(404).end()
    }
})

//delete a movie to a list
app.delete('/listes/:list_id/movies_list/:film_id', async (req, res) => {
    try {
        let liste = await db.get(req.params.list_id)
        let index = liste.films.indexOf(parseInt(req.params.film_id))
        liste.films.splice(index, 1)
        db.put(req.params.list_id, liste)
        console.log(liste)
        res.status(200).json(liste)
    } catch (err) {
        res.status(404).end()
    }
})