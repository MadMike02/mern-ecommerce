import mongoose from 'mongoose'

const connectDB = async () => {
    try{
        const conn =await mongoose.connect((process.env.DB),{
            useNewUrlParser: true,
            useUnifiedTopology:true
        })

        console.log(`MongoDB connected : ${conn.connection.host}`.cyan.underline)
    }catch (error)
    {
        console.log(`ERROR: ${error.message}`.red.underline.bold)
        process.exit(1)
    }
}

export default connectDB