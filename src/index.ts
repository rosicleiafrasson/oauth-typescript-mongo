import App from './app'
import database from './database'

database()
const app = new App()
app.start()