# Todo MERN Fullstack Project 

## General Overview
<p>This application allows people to create todo lists! It is a solo project made for fun, as a proof of concept and learning experience, and also because I wanted a Todo app that I could use to delegate work at home. Each list is named (e.g. Chores, Groceries, Meals, etc.), and can include many named collaborators. Each task is assigned to a person who will get it done! If you are working on your own, you can always just add one person rather than include collaborators. The app allows you to edit existing tasks, eliminate completed tasks, and delete old lists.</p>

<p>This is a CRUD (Create Read Update Delete) application that was built with the MERN (MongoDB, ExpressJS, React, and Node) stack and uses Bootstrap elements for styling, along with Github Actions for CI/CD through Heroku <a href="https://todo-app-rw.herokuapp.com/">at this link</a>.</p>

## Details on Application Construction
<p> The files in this repository make up an Express Application. Express is setup to serve static files through the public directory. The public directory contains a build of the front end React Application. You can find the React front end project here: <a href="https://github.com/rweisberger/family-todo-list">React Front End Repo</a>. A cluster through MongoDB atlas is used as the database. On the front end, Axios is being used to communicate with the back end's RESTful API. </p>

### Machine Setup
<ul>
  <li>Node Version 16+</li>
  <li>npm</li>
</ul>

## Run Project Locally

<p> Clone this repo and pull it down to your machine. Open your terminal and navigate to the project directory. Run <npm install> to install all of the dependencies. After completed you can start the local server with <npm start> or <nodemon start> and it will open on port 4000.
  
<p>If you would like to run the front end and back end separetely, you will need to comment out line 14 in the index.js file in the Express app. This will disable serving static files. Now, you will need to clone the <a href="https://github.com/rweisberger/family-todo-list">React Front End Repo</a> and pull it down to your machine. Again, use the terminal to navigate to the main directory and run <npm install> to install all of the dependencies. Run <npm start> to start the React app on port 3000.</p>
  
## Roadmap for Improvements
<p>As with any project there are is always room for boundless growth and improvement. Here, I will limit my list of goals to three and explain why I find them most interesting or important.</p>
<ol>
  <li><b>Implement React Redux</b>: There are several componenets that need to share state in order for the lists to be updated correctly in the UI. Instead of "prop drilling" and passing the props through multiple component levels, I chose to move a couple of state variables into React's Context. This was not my orginal intention for using Context. I think that moving the state variables into Redux would make the app more efficient and reduce unnecessary rerenders.</li>
  <li><b>Improve Authentication</b>: I would live to imporove the route protection component and use a JSON Web Token to practice with better, and more secure logins.</li>
  <li><b>Improve Route Naming</b>: I belive that the routes could be made more consistent in their naming. A POST, PATCH, and DELETE route could all be made to '/task', rather than making each request to a different path as I am doing now.</li>
</ol>
  
## Contact
<p>If you have any questions or suggestions please contact me at rachel.weisberger@gmail.com</p>
  
  
