let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const { ORDER } = require('mysql/lib/PoolSelector');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Content-Type", "application/json");
    next();
});

app.listen(port, () => {
    console.log('Node App is running on port '+port)
})


// homepage route
app.get('/', (req, res) => {
    return res.send({
        error: 0,
        message: 'Welcome to NIPA-API',
        written_by: 'Natthavut Apinantakun'
    })
})

// connection to masql database
let dbCon = mysql.createConnection({

    host: 'app-ce6be604-df9b-4026-872d-1c3b89294f67-do-user-11127953-0.b.db.ondigitalocean.com',
    user: 'node-api-nipa',
    password: 'UCLsTWTo3aK7o4mB',
    database: 'node-api-nipa',
    port : 25060,
    sslmode  : require

})
dbCon.connect();

//retrieve all tickets can sort by status and last update
app.get('/tickets', (req, res) => {
    let query = "ORDER BY";

    if (req.params['status-sort'] != undefined) {
        query += ","+` status ${req.params['status-sort']}`;
    }
    if (req.body['last-update-sort'] != undefined) {
        query += ","+` last_update ${req.params['last-update-sort']}`;
    }
    if(query=="ORDER BY"){
        query = "";
    }
    query = query.replace(",", "");

    dbCon.query(`SELECT * FROM tickets ${query}`, (error, results, fields) => {
        if (error) throw error;
        let arrResult = []

        for (let i = 0; i < results.length; i++) {

            let result = {
                id: results[i]['id'],
                title: results[i]['title'],
                description: results[i]['description'],
                status: results[i]['status'],
                contact: {
                    name: results[i]['name'],
                    lastname: results[i]['lastname'],
                    address: results[i]['address'],
                    telephone: results[i]['telephone'],
                    email: results[i]['email']

                },
                created_at: dateTime(results[i]['created_at']),
                last_update: dateTime(results[i]['last_update'])
            }
            arrResult.push(result)
        }

        let message = ""
        if (results == undefined || results.length == 0) {
            message = "Tickets table is empty";
        } else {
            message = "Successfully retrieved all tickets";
        }
        return res.send({ error: 0, data: arrResult, message: message });
    })
})

// funtion tranto date time
function dateTime(dateTime) {
    return new Date(dateTime).toLocaleString("en-US", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
        second: '2-digit'
    }).replace(" 24", " 00")
}

// add a new ticket
app.post('/tickets/create', (req, res) => {
    let title = req.body.title;
    let description = req.body.description;
    let name = req.body.name;
    let lastname = req.body.lastname;
    let address = req.body.address;
    let telephone = req.body.telephone;
    let email = req.body.email;
    const emailvalidator = require("email-validator");
    const validatePhoneNumber = require("validate-phone-number-node-js");

    // validation
    if (!title || !description || !name || !lastname || !address) {
        return res.status(400).send({ error: 1, message: "Please provide tickets title, description, name, lastname  and address" });
    } else if (!email || !emailvalidator.validate(email)) {
        return res.status(400).send({ error: 2, message: "Please provide your email or invalid email" })
    } else if (!telephone || !validatePhoneNumber.validate(telephone)) {
        return res.status(400).send({ error: 3, message: "Please provide your telephone number or invalid telephone number" });
    } else {

        dbCon.query("SELECT COUNT(*) as id from tickets",(error, results, fields) => {
            var id = results[0].id + 1;
            dbCon.query('INSERT INTO tickets (id,title,description,name,lastname,address,telephone,email) VALUE(?,?,?,?,?,?,?,?)', [id,title, description, name, lastname, address, telephone, email], (error, result, field) => {
                if (error) throw error;
                return res.send({ error: 0, data: result, message: "Ticket successfully added" });
            })
        })    

    }
})

//retrieve ticket by status
app.get('/tickets/filter/:status', (req, res) => {
    let status = req.body.status;

    if (!status) {
        return res.status(400).send({ error: 1, message: 'Please provide status of ticket' })
    } else {
        dbCon.query("SELECT * FROM tickets WHERE status = ? ", status, (error, result, fields) => {
            if (error) throw error;

            let message = "";
            if (message === undefined || result.length == 0) {
                message = "Ticket Not Found!"
            } else {
                message = "Successfully retrieved ticket data when status is " + status;
            }
            return res.send({ error: 0, data: result, message: message })
        })
    }
})

//update infomation ticket by id
app.put('/tickets/edit', (req, res) => {
    let id = req.body.id;
    const emailvalidator = require("email-validator");
    const validatePhoneNumber = require("validate-phone-number-node-js");
    const listStatus = new Set(["pending", "accepted", "resolved", "rejected"]);

    //validation
    if (req.body['email'] != undefined && !emailvalidator.validate(req.body['email'])) {
        return res.status(400).send({ error: 2, message: "Please provide your email or invalid email" })
    } else if (req.body['telephone'] != undefined && !validatePhoneNumber.validate(req.body['telephone'])) {
        return res.status(400).send({ error: 3, message: "Please provide your telephone number or invalid telephone number" });
    } else if (req.body['status'] != undefined && !listStatus.has(req.body['status'])) {
        return res.status(400).send({ error: 4, message: "Please provide your status or invalid status" });
    }

    let query = "";
    for (key in req.body) {
        if (!req.body[key] || req.body[key].length == 0) {
            continue;
        }

        if (key != 'id') {
            query += ", " + key + "=" + `'${req.body[key]}'`;

        }

    }
    query = query.replace(", ", "");
    if (query.length == 0) {
        return res.status(400).send({ error: 1, message: "Please fill in the blank value" })
    } else {
        dbCon.query(`UPDATE tickets SET ${query} WHERE id = ?`, [parseInt(id)], (error, result, field) => {

            if (error) throw error;
            if (result.changedRows == 0) {
                message = "Tickets not found or data are same";
            } else {
                message = "Ticket successfully status update";
            }
            return res.send({ error: 0, data: result, message: message });
        })
    }



})

module.exports = app;
