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

// create account
app.post('/account/newUser', async (req, res) => {
    const collection = db.collection('users');
    const { email, password, name } = req.body;
    console.log('reqBOD:', req.body);
        try{
            const users = await collection.find({ email: email })
                                          .toArray() 
            // console.log('users', users);
            if (users.length > 0) {
                res.status(409).send('User already exists')
            } else {
                collection.insertOne({ name: name, email: email, password: password, lists: [] });
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
             const [{ name, email, lists}] = users;
             res.json({name, email, lists}).status(200);
            } else {
             res.status(404).send("Not found");
        };
    } catch (err) {
        res.send(err);
    }
}); 

// create list
// each list should have an id, name and users
app.post('/create/list/name', async (req, res) =>{
    const collection = db.collection('users');
    const { email, listName} = req.body;
    console.log(email, listName);
    let listId = `${listName}${Math.floor(Math.random()*10000)}`
    try{
        collection.findOneAndUpdate(
            {email: email},
            {$push: {
                lists:
                    { 'listId' : listId,
                      'listName' : listName,
                      'helpers' : [],
                      'todos': []
                    }
            }}
        )    
        res.status(200).send({docs: listId, message: "Success! New list created!"});
    } catch (err) { 
        res.send(err)
    }
});

// I think that adding the helpers will need to be done separately
app.post('/create/list/addHelpers', async (req, res) =>{
    const collection = db.collection('users');
    const { email, listId, helper} = req.body;
    console.log(email, listId, helper);
    try{
        collection.findOneAndUpdate(
            {email: email, 'lists.listId': listId},
            {$addToSet: { 'lists.$.helpers': helper }} // addToSet will prevent duplicates
        )    
        res.status(200).send('Request sent');
    } catch (err) { 
        res.send(err)
    }
});
            
// get all lists
app.get('/lists/:email', async (req, res) => {
    const collection = db.collection('users');
    console.log(req.params)
    try{
        let response = await collection.findOne({ email: req.params.email });
        console.log(response.lists)
        res.status(200).send(response.lists);
    } catch (err) {
        res.send(err)
    }
})

// create task
app.post('/create/task', async (req, res) => {
    const collection = db.collection('users');
    const { email, listId, description, assignedTo } = req.body;
    let id = uuidv4();
    try{
        console.log(listId, id, description, assignedTo)
        const updated = await collection.findOneAndUpdate(
            {email: email, 'lists.listId': listId},
            {$push: { 'lists.$.todos': {
                                        "taskId": id,
                                        "description": description,
                                        "assignedTo": assignedTo
                                       } 
            } }, 
            {returnDocument: 'after'} 
        );   
        console.log('updated', updated.value.lists);
        res.send({docs: updated.value, message:"Request sent"});
    } catch (err) {
        res.send(err)
    }

});

//  db.searchArrayDemo.find({EmployeeDetails:{$elemMatch:{EmployeePerformanceArea : "C++", Year : 1998}}}).pretty();

app.delete('/delete/task/:taskId', async (req, res) => {
    const collection = db.collection('users');
    // const { taskId, email, listName } = req.body;
    // only using taskID while working with one list
    console.log(req.params.taskId, 'id from request body');
    try{
        const items = await collection.find({'lists.todos.taskId': req.params.taskId})
        .toArray() 
        // console.log("items", items);
        const item = items[0];
        console.log('item', item)
        const { lists } = item;
        console.log('lists', JSON.stringify(lists));
        lists.forEach(list => {
            let filtered = (list.todos.filter(todo=> todo.taskId !== req.params.taskId));
            list.todos = filtered;     
        })
        collection.replaceOne(
            {_id : item._id},
            item
        )
        console.log('after replace', lists);
        res.json(lists).status(200);
    } catch (err) {
        res.send(err)
    }
})
app.delete('/delete/list/:email/:listId', async (req,res) => {
    const collection = db.collection('users');
    const { email, listId } = req.params;
    try{
        // console.log(email, listId )
        const items = await collection.find({email : email}).toArray();
        const item = items[0];
        const { lists } = item;
        // console.log('lists', lists)
        let filteredLists = lists.filter(list=> list.listId !== listId)
        item.lists = filteredLists;
        console.log(filteredLists, item.lists);
        collection.replaceOne(
            {email : email},
            item
        )
        console.log('cursor', items);
        res.send({docs:items, message:"Request sent"});
    } catch(err) {
        res.send(err)
    }

})

// delete account
app.delete('/delete/account/:email/', async (req, res) => {
    console.log("request", req.params)
    const collection = db.collection('users');
    const query = {
        email: req.params.email,
    }
    try{
        collection.deleteOne(query);
        res.status(202)
    } catch (err) {
        res.send(err)
    }
})



app.listen(port, () => (console.log('running on port 4000')));