# ProjectX Exemplary code
These code examples taken from the 'projectx' module show some essential building blocks of the package:
* Webapp using Javascript, HTML, CSS and React+Redux and D3.js
* Server Backend and API using Node.js, express.js and postgresql

## 1. Serverside Backend Code

### 1.1 server.js
This file defines the express web app, including the ports to listen to and the command to serve the static webapp 
bundle in case of production mode.
In addition, a cron job is defined, which will activate the function 'updateData' regularly. The latter will start a
Python process to import new data via the alphavantage API for stock data, push it through the data processing pipe for
normalisation and cleaning and finally updating the Postgres database.

Data within the Postgres database is accessed via the GET API '/api/allData' and sent in json format
to the client.

If new trades shall be processed and stored within the database, the POST API '/api/addTrade' is used.

### 1.2 scss_to_css.sh
A small utility script to convert all *.scss files within a 'scss' folder to *.css files which can be easily
used by the React web app. The script is integrated in the webpack bundling process (see 'css' script in package.json)

## 2. webapp code
See the code within the client folder.

### 2.1 src
Contains all of the webapps source code

#### 2.1.1 actions and reducers
These folders contain all actions and reducers used within the app in the style of the Flux pattern implemented by Redux:
An action can be dispatched to the store, which is the single source of truth. Here, the reducers are used to create a
new copy of the state, modified by the action. The newly created store is returned as used as the new source of
truth in the app.

#### 2.1.2 components and containers
The 'presentational and container components' pattern for React is used.
The presentational components are concerned with 'how things look', using CSS styles. The do not contain any business
logic are access / dispatch to the redux store. 
The container components are concerned with 'how things work', make use of the redux store and render other containers
or presentational components. With this division, it is easy to exchange presentational components without the need to 
deal with functionality, therefore it is easy for designers to twist the looks without interfering with the engineers
optimising the functionality. Furthermore, well designed presentational components can be easily reused in another place,
only appropriate containers need to be created.

### 2.2 scss and css
This folder contains all scss files. The advantage of scss compared to standard css is e.g. the possibility to 
define variables than can be imported in the various scss files. Thus, styles can be modularised and still share some
common properties. The scss files can be converted to css using the 'node-sass' preprocessor.