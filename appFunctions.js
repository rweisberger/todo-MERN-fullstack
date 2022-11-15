
function createUser(name, email, password){};

function findUser(email){};

function setupList(listName, helpers){};

function deleteListItem(email, listName, item){};

function addListItem(email, listName, item){};
let data={users: [{name:'Rachel', email:'rachel@gmail.com', password:'secret'}]};

app.get('/login/:email/:password', (req, res) => {
    // read username and password from request body
    console.log(req.params)
    let user = data.users.find({ id: req.params.email }).value();
    if(!user) {
        res.status(404).send("Not found")
    } else if (user.password === req.params.password) {
        res.send(user)};

    // filter user from the users array by username and password
    // const user = users.find(u => { return u.username === username && u.password === password });

    // if (user) {
        // // generate an access token
        // const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
        // const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

        // refreshTokens.push(refreshToken);

        // res.json({
        //     accessToken,
        //     refreshToken
        // });
    // } else {
    //     res.send('Username or password incorrect');
    // }
});

const getAllTasks = () => {
    return new Promise((resolve, reject) => {
      collection.find({}).toArray(function(err, tasks){
        err ? reject(err) : resolve(tasks);
      })
    })
  }
  
  const createTask = ({description, userId}) => {
    return new Promise((resolve, reject) => {
      collection.insertOne({
        userId,
        description,
        isComplete: false
      }).then(function(res) {
        resolve(res.insertedId.toString())
      }).catch(function(err) {
        reject(err)
      })
    })
  }


