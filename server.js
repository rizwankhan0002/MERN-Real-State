import express from 'express'

//App Config
const app = express()
const port = process.env.PORT || 5000

app.listen(port, () => console.log('Server started on PORT : '+ port))