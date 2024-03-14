import mongoose from 'mongoose';

const DBconnection = async () => {
    const MONGO_URL = `mongodb+srv://omsingh32123:MongoDBPassword@projectvault.lf71zkd.mongodb.net/?retryWrites=true&w=majority`;
    try{
        await mongoose.connect(MONGO_URL,{useNewUrlParser: true});
        console.log('Database Connected Successfully');
    }
    catch(error)
    {
        console.error('Error while connecting to Database',error.message);
    }
}

export default DBconnection;