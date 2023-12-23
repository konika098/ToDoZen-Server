const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Todo list server is running')
})

app.listen(port, () => {
    console.log(`Todo list is listening on port: ${port}`)
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ycrlcva.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hrhwfvt.mongodb.net/?retryWrites=true&w=majority`;

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
        // await client.connect();

        const todoListCollection = client.db("ToDoZenDB").collection("ToDoList");
        const ongoingListCollection = client.db("ToDoZenDB").collection("onList");
        const completedListCollection = client.db("ToDoZenDB").collection("completedList");

        app.get('/allTodoList', async (req, res) => {
            const result = await todoListCollection.find().toArray();
            res.send(result)
        })

        app.get('/todoList', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const result = await todoListCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/todoList', async (req, res) => {
            const TodoItem = req.body;
            const result = await todoListCollection.insertOne(TodoItem)
            res.send(result)
        })
        app.delete('/todoList/:id', async (req, res) => {
            const taskID = req.params.id
            const query = { _id: new ObjectId(taskID) }
            const result = await todoListCollection.deleteOne(query)
            res.send(result)
        })

        app.delete('/todoList2/:id', async (req, res) => {
            const taskID = req.params.id
            const query = { _id: taskID }
            const result = await todoListCollection.deleteOne(query)
            res.send(result)
        })
        // app.patch('/todoList3/:id', async (req, res) => {
        //     const id = req.params.id
        //     const filter = { _id: new ObjectId(id) }
        //     const updateProperty = req.body;
        //     const result = await todoListCollection.updateOne(filter, { $set: updateProperty })
        //     res.send(result)
        // })
        // app.patch('/todoList4/:id', async (req, res) => {
        //     const id = req.params.id
        //     const filter = { _id: id }
        //     const updateProperty = req.body;
        //     const result = await todoListCollection.updateOne(filter, { $set: updateProperty })
        //     res.send(result)
        // })





        app.get('/ongoingList', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const result = await ongoingListCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/ongoingList', async (req, res) => {
            const TodoItem = req.body;
            const result = await ongoingListCollection.insertOne(TodoItem)
            res.send(result)
        })

        app.delete('/ongoingList/:id', async (req, res) => {
            const ongoingID = req.params.id
            const query = { _id: ongoingID }
            const result = await ongoingListCollection.deleteOne(query)
            res.send(result)
        })



        app.get('/completedList', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const result = await completedListCollection.find(query).toArray();
            res.send(result);
        });

        app.post('/completedList', async (req, res) => {
            const completedItem = req.body;
            const result = await completedListCollection.insertOne(completedItem)
            res.send(result)
        })

        app.delete('/completedList/:id', async (req, res) => {
            const completedID = req.params.id
            const query = { _id: completedID }
            const result = await completedListCollection.deleteOne(query)
            res.send(result)
        })





        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
