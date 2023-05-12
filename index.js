const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.eqk9iwm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

async function run() {
   try {
      await client.connect();
      const coffeeCollection = client.db('coffeeDB').collection('coffee')

      app.get('/coffee', async (req, res) => {
         const cursor = coffeeCollection.find();
         const result = await cursor.toArray();
         res.send(result);
     })

      app.post('/coffee', async (req, res) => {
         const newCoffee = req.body;
         console.log(newCoffee);
         const result = await coffeeCollection.insertOne(newCoffee);
         res.send(result);
      })

      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // await client.close();
   }
}
run().catch(console.dir);



app.get('/', (req, res) => {
   res.send('coffee making server is available')
})
app.listen(port, () => {
   console.log(`Coffee server is running at ${port}`)
})
