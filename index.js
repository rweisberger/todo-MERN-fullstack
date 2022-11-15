const express = require('express');
const cors = require("cors")
const bodyParser= require('body-parser');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))

const port = process.env.PORT || 4000;


let data={ users: [[{name:'Rachel', email:'rachel@gmail.com', password:'secret'}],
                 [{name:'Bill', email:'bill@gmail.com', password:'password'}]]
         };
            
// app.post('/', async (req, res) => {
//     try{ 
//         console.log('POST request')
//         res.status(200).send('POST request')
//     } catch(err){
//         res.send(err)
//     }
// })

// create account
app.post('/account/newUser/:name/:email/:password', async (req, res) => {
    try {
        data.users.push([{name:req.params.name, email: req.params.email, password:req.params.password}]);
        res.status(200).send('creating account');
        console.log(JSON.stringify(data));
    } catch (err) {
        res.send(err);
    }
    // console.log('successfully created account with data: ', req.body);
    // database.createAccount(req.body);
    // res.send('Account created!');
    // try {
    //     console.log('successfully created account with data: ', req.body);
    //     database.createAccount(req.body);
    //     throw Error('whoops');
    //     res.send('Account created!');
    // } catch (err) {
    //     console.error('Error creating account: ', req.body);
    //     res.send(err);
    // }
    // console.log('create account request',req);
    // res.send('create an account')
});

app.get('/login/:email/:password', async (req, res) => {
    // read username and password from request body
    console.log(req.params.email, req.params.password);
    try{
        let [user] = data.users.find(item=> item.find(item => item.email === req.params.email))
        if (user.password === req.params.password) {
             console.log(user.password)
             res.send(`finding user: ${user.name}`);
            } else {
             res.status(404).send("Not found");
        };
    } catch (err) {
        res.send(err);
    }
}); 

// create list
// each list should have an id, name and users
app.post('/create/list/:email/:listName', async (req, res) =>{
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
    let id = uuidv4();
    console.log(req.params, id)
    res.send(`create new task ${id}`);
});



app.listen(port, () => (console.log('running on port 4000')));