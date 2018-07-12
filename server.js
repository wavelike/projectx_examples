const express = require("express");
const fs = require("fs");
const cron = require('node-cron');
const spawn = require("child_process").spawn;

const app = express();
app.set("port", process.env.PORT || 3001);

app.listen(app.get("port"), () => {
    console.log(`Server Port: http://localhost:${app.get("port")}/`);
});

// When in production, use the static build
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));  // path to hosted static files in production
}

// Initialise postgres client
const { Client } = require('pg');
let client = null;

// Connect to postgres dependent on the environment (production or development)
if (process.env.NODE_ENV === "production") {
    client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    });
    client.connect();
}
else {
    let connectionString = "postgres://sebastian:xyz@localhost:123/sebastian";
    client = new Client(connectionString);
    client.connect();
}

// bodyParser reads bodies of API requests
const bodyParser = require('body-parser');

//configure body-parser for express
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Calls python scripts to import new stock data, do data analysis calculations and store result
let updateData = () => {
    console.log("Starting python process: update data");

    let param = "noParam";
    let dataProcess = null;
    if (process.env.NODE_ENV === "production") {
        process.chdir('./projectxbackend/projectxbackend');
        dataProcess = spawn('python', ["daily_udpate.py", param]);
        process.chdir('../..');
    }
    else {
        process.chdir('./projectxbackend/projectxbackend');
        dataProcess = spawn('/home/sebastian/miniconda3/envs/projectx2/bin/python3.6',["daily_update.py", param]);
        process.chdir('../..');
    }

    // On the event of stdout in the python script (logger information), activate this callback and store logging messages
    dataProcess.stdout.on('data', function (data){
        let bufferOriginal = Buffer.from(data.data);
        let newData = bufferOriginal.toString('utf8');

        fs.writeFile("./tmp/tmp1.txt", newData, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    })
};

// Activate 'updateData' periodically
cron.schedule('*/15 * * * *', function(){
    // cron time: second(optional) minute hour dayOfMonth month dayOfWeek
    console.log('starting new cron task');
    updateData();
});

let accessCode = 78329;
// This API call returns the full available data
app.get("/api/allData", (req, res) => {
    const param = req.query.p;

    console.log("Received 'allData' GET request");

    if (!param) {
        res.json({
            error: "Missing required parameter `p`"
        });
        return;
    }

    // small naive security wall
    if (param === accessCode) {
        console.log("query db");

        // inner query command: selects the most recent processId
        // outer query command: selects only those rows with most recent processId
        let queryString = "SELECT * FROM simActions WHERE (process_id=(SELECT process_id FROM simActions ORDER BY " +
            "datetime DESC, process_id DESC LIMIT 1) AND accepted='false') OR (accepted='true' AND " +
            "closed='false' AND position_type != 'flat') ;";

        // query postgres database
        client.query(queryString,
            (err, data) => {
                if (err) throw err;

                // Add each result row of query to outData
                let outData = {"data": []};
                for (let row of data.rows) {
                    outData["data"].push(row)
                }

                // send data to client with status code 200
                res.status(200).send(JSON.stringify(outData));
            })
    }
    else
        res.status(400); // if accessCode is wrong, send status code 400
});


app.post("/api/addTrade", function(req, res) {
    const param = req.query.p;

    console.log("Received 'addTrade' POST request");

    // small naive security wall
    if (param === accessCode) {
        let body = req.body;

        // Call python code with the requests body in json format as parameter, which process the new data and
        //  add the trade to the database
        process.chdir('./investing_strategy/investing_strategy');
        let process_broker_trade = spawn('python', ["add_trade.py", JSON.stringify(body)]);
        process.chdir('../..');

        // Wait for output of python process, signifying the process state
        process_broker_trade.stdout.on('data', function(data) {
            let json2 = JSON.stringify(data);
            let bufferOriginal = Buffer.from(JSON.parse(json2).data);
            let newData = bufferOriginal.toString('utf8');

            if (newData.includes("code111")) {
                console.log("Server: New broker trade included successfully");
                res.status(111);
            }
            else
            if (newData.includes("code411")) {
                console.log("Server: simulated corresponding trade does not exist");
                res.status(411);
            }
            else
            if (newData.includes("code422")) {
                console.log("Server: process id cannot exist several times for a single symbol");
                res.status(422);
            }
            else
            if (newData.includes("code433")) {
                console.log("Server: Trade already exists");
                res.status(433);
            }
        });
    }
    else
        res.status(400);  // if accessCode is wrong, send status code 400
});