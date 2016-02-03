# Technology Selection #

#### Node.js / Express.js ####
We’ll use node.js to develop the http server. Express.js is a basic MVC framework based on node.js. Both of these are the requirements of this project.

#### SQLite ####
Because of the hardward limit on the BBB, we have to consider a lightweight database to store those persistent information. SQLite is a good choice, because it occupies little space on the disk and could be run on the ARM architecture.

#### Sequelize ####
Sequelize is an ORM tool for node.js. Because our application might involves in lots of operations on the DB, and we would like to implement those operations in an OO way, so an ORM library could allow us to write Object-oriented code instead of writing SQL statements directly.

#### Bootstrap ####
Because we have to run our client side in a browser on a mobile device, our program needs to be responsive. Bootstrap is a responsive HTML5 framework, including many useful components we can use directly in our font-end.

#### Angular.js ####
Angular is a MVVM framework for javascript. Our font-end needs to interact with the server very frequently. Each time the browser sends an ajax request to the server, it needs to update the documents and views. Using a MVVM framework helps save time on those developments.

#### underscore.js ####
We might also use underscore, which provides many useful functions. We just use those functions instead of re-inventing the wheels.
 
#### Sea.js ####
Sea.js is a javascript framework for modular developments. It allows use to organize front-end javascript in a similar way to back-end javascript (node.js). With sea.js, we can easily avoid the conflicts of many js files. So it is necessary for team development.  

#### Grunt ####
Grunt is a task runner for javascript. We can avoid performing  performing repetitive tasks like minification, compilation, a and unit testing. Especillay 
