const express = require('express');
const cors = require("cors")
const bodyParser= require('body-parser');

const { v4: uuidv4 } = require('uuid');

const app = express();
const MongoClient = require('mongodb').MongoClient;


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 4000;

const url =
'mongodb+srv://DBMainUser:hPu7sp3hGSCxkjEP@cluster0.pprbo47.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
const dbName = "todo_project";
let db;
let collection;
async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  db = client.db(dbName);
  collection = db.collection("users");
}

main()
//   .then(console.log)
//   .catch(console.error);

let data={ users: [[{name:'Rachel', email:'rachel@gmail.com', password:'secret'}],
                 [{name:'Bill', email:'bill@gmail.com', password:'password'}]]
         };
            
// create account
app.post('/account/newUser', async (req, res) => {
    const collection = db.collection('users');
    const { email, password, name } = req.body;
    console.log('reqBOD:', req.body);
        try{
            const users = await collection.find({ email: email })
                                          .toArray() 
            console.log('users', users);
            if (users.length > 0) {
                res.status(409).send('User already exists')
            } else {
                collection.insertOne({ name: name, email: email, password: password });
                res.status(200).send('Account created');
            }
        } catch (err) {
            res.send(err);
        };        
});

// Bill says this also should be a post request because we are sending info and its better to use a header
app.post('/login', async (req, res) => {
    // read username and password from request body
    // destructuring to access email and password
    const collection = db.collection('users');
    const { email, password } = req.body
    console.log(email, password);
    try{
        // I think searching for a completed match with user and password is fine- 
        // we don't want to send a message that says that the user exists, but the 
        // password doesn't match for security reasons
        let users = await collection.find({ email: email, password: password })
                                    .toArray() 
        if (users.length > 0) {
             console.log(users)
             const [{ name }] = users;
             res.send(`Found user: ${name}`);
            } else {
             res.status(404).send("Not found");
        };
    } catch (err) {
        res.send(err);
    }
}); 

// create list
// each list should have an id, name and users
app.post('/create/list', async (req, res) =>{
    const collection = db.collection('users');
    const { email, listName } = req.body
    try{
        console.log(req.params);    
        res.status(200).send("create new list");

    } catch (err) { 
        res.send(err)
    }
    // console.log('create new list', req.params);

});

// create task
app.get('/create/task/:email/:description/:assignedTo', async (req, res) => {
    try{
        let id = uuidv4();
        console.log(req.params, id)
        res.send(`create new task ${id}`);
    } catch (err) {
        res.send(err)
    }

});

app.delete('/delete/task/:email/:id', async (req, res) => {
    try{
        console.log(req.params);
        res.send('request to delete task')
    } catch (err) {
        res.send(err)
    }


})



app.listen(port, () => (console.log('running on port 4000')));