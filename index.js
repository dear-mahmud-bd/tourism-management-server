const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;





// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.cbr06.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const spotCollection = client.db('wanderSEA_DB').collection('all_spot');

        
        app.get('/all-spot', async (req, res) => {
            const cursor = spotCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/all-spot/:_id', async (req, res) => {
            const id = req.params._id;
            if (!ObjectId.isValid(id)) {
                return res.status(400).send({ message: 'Invalid ID format. ID must be a 24-character hexadecimal string.' });
            }
            const query = { _id: new ObjectId(id) }
            const result = await spotCollection.findOne(query);
            res.send(result);
        })

        app.post('/all-spot', async (req, res) => {
            const newSpot = req.body;
            // console.log(newSpot);
            const result = await spotCollection.insertOne(newSpot);
            res.send(result);
        })


        app.get('/user-spot', async (req, res) => {
            const userEmail = req.query.user_email;
            // console.log({ user_email: userEmail });
            const query = { user_email: userEmail };
            const cursor = spotCollection.find(query); 
            const result = await cursor.toArray(); 
            res.send(result); 
        });



        
        
        
        app.delete('/all-spot/:_id', async (req, res) => {
            const id = req.params._id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await spotCollection.deleteOne(query);
            res.send(result);
        })
        
        

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);













app.get('/', (req, res) => {
    res.send('Server Connected Successfully for WanderSEA');
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})