const app = require('./app')
const {PORT} = process.env

app.listen(2800, () => console.log(`Server is running at port ${PORT}...`));