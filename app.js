

const express = require('express')
const app = express()
const port = 3000
const level = require('level')
const db = level('./db', { valueEncoding: 'json' })

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

app.post('/movies',async (req,res)=>{
    let objetFilm=req.body
     await db.put(objetFilm.id,objetFilm)
        console.log(objetFilm.id + objetFilm)
    res.status(200).json(objetFilm)
})

app.get('/movies/:id', async (req,res)=>{
    try{
        let movie=await db.get(req.params.id)
        console.log(movie)
        res.status(200).json(movie)
    }
   catch(err){
        res.status(404).end()
   }

})

app.put('/movies/:id', async (req,res)=>{
    await db.put(req.params.id,req.body)
    res.status(200).json(req.body)
})

app.delete('/movies/:id', async(req,res)=>{
    await db.del(req.params.id)
    res.status(200).json("Suprimmé!!!!")
} )



//routes des listes

app.post('/listes',async(req,res)=>{
    let filmListe=req.body
    await db.put(filmListe.id,filmListe)
    console.log(filmListe.id + filmListe)
    res.status(200).json(filmListe)
})

app.get('/listes/:id', async (req,res)=>{
    try{
        let liste=await db.get(req.params.id)
        console.log(liste)
        res.status(200).json(liste)
    }
    catch(err){
        res.status(404).end()
    }
})

app.put('/listes/:id', async (req,res)=>{
    await db.put(req.params.id,req.body)
    res.status(200).json(req.body)
})

app.delete('/listes/:id', async(req,res)=>{
    await db.del(req.params.id)
    res.status(200).json("Suprimmé!!!!")
} )

app.post('/listes/:id/films', async (req,res)=>{
    try{
        let liste=await db.get(req.params.id)
        liste.films.push(req.body.film_id)
        db.put(req.params.id,liste)
        console.log(liste)
        res.status(200).json(liste)
    }
    catch(err){
        res.status(404).end()
    }
})

app.delete('/listes/:id/films/:filmId', async (req,res)=>{
    try{
        let liste=await db.get(req.params.id)
        let index=liste.films.indexOf(req.params.filmId)
        liste.films.splice(index,1)
        db.put(req.params.id,liste)
        console.log(liste)
        res.status(200).json(liste)
    }
    catch(err){
        res.status(404).end()
    }
})