const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dagwi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('db connected')
async function run() {
    try {

        await client.connect();
        const warehouseCollection = client.db('warehouseManagement').collection('products');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = warehouseCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.post('/products', async (req, res) => {
            const query = req.body;
            const result = await warehouseCollection.insertOne(query);
            res.send(result)
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = warehouseCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send(accessToken)
        })
        app.get('/myProducts', async (req, res) => {
            const email = req.query.email;
            const query = { email };
            const cursor = warehouseCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)

        })
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateProduct.quantity,
                },
            };
            const result = await warehouseCollection.updateOne(filter, updateDoc, options);
            res.send(result)

        })
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await warehouseCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('runing warehouse management server ');
})

app.listen(port, () => {
    console.log('runing  port : ', port);
})
