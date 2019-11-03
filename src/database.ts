import mongoose from 'mongoose'

async function connect(){

    try{
        await mongoose.connect('mongodb://mongo:27017/chamados', {
            useNewUrlParser: true
        });
        console.log('>>> Database connected')
    }catch(error) {
        console.log('Error in Database connect' + error)
    }
}
export default connect