let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const { ORDER } = require('mysql/lib/PoolSelector');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// homepage route
app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to NIPA-API',
        written_by: 'Natthavut Apinantakun'
    })
})

// connection to masql database
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_api'

})
dbCon.connect();

//retrieve all tickets can sort by status and last update
app.get('/tickets', (req, res) => {
    let query = "ORDER BY";

    if (req.body['status-sort'] != undefined) {
        query += ","+` status ${req.body['status-sort']}`;
    }
    if (req.body['last-update-sort'] != undefined) {
        query += ","+` last_update ${req.body['last-update-sort']}`;
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
        return res.send({ error: false, data: arrResult, message: message });
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
        return res.status(400).send({ error: true, message: "Please provide tickets title, description, name, lastname  and address" });
    } else if (!email || !emailvalidator.validate(email)) {
        return res.status(400).send({ error: true, message: "Plrase provide your email or invalid email" })
    } else if (!telephone || !validatePhoneNumber.validate(telephone)) {
        return res.status(400).send({ error: true, message: "Plrase provide your telephone number or invalid telephone number" });
    } else {
        dbCon.query('INSERT INTO tickets (title,description,name,lastname,address,telephone,email) VALUE(?,?,?,?,?,?,?)', [title, description, name, lastname, address, telephone, email], (error, result, fields) => {
            if (error) throw error;
            return res.send({ error: false, data: result, message: "Ticket successfully added" });
        })

    }
})

//retrieve ticket by status
app.get('/tickets/filter/:status', (req, res) => {
    let status = req.body.status;

    if (!status) {
        return res.status(400).send({ error: true, message: 'Please provide status of ticket' })
    } else {
        dbCon.query("SELECT * FROM tickets WHERE status = ? ", status, (error, result, fields) => {
            if (error) throw error;

            let message = "";
            if (message === undefined || result.length == 0) {
                message = "Ticket Not Found!"
            } else {
                message = "Successfully retrieved ticket data when status is " + status;
            }
            return res.send({ error: false, data: result, message: message })
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
        return res.status(400).send({ error: true, message: "Please provide your email or invalid email" })
    } else if (req.body['telephone'] != undefined && !validatePhoneNumber.validate(req.body['telephone'])) {
        return res.status(400).send({ error: true, message: "Plrase provide your telephone number or invalid telephone number" });
    } else if (req.body['status'] != undefined && !listStatus.has(req.body['status'])) {
        return res.status(400).send({ error: true, message: "Plrase provide your status or invalid status" });
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
        return res.status(400).send({ error: true, message: "Please fill in the blank value" })
    } else {
        dbCon.query(`UPDATE tickets SET ${query} WHERE id = ?`, [parseInt(id)], (error, result, field) => {

            if (error) throw error;
            if (result.changedRows == 0) {
                message = "Tickets not found or data are same";
            } else {
                message = "Ticket successfully status update";
            }
            return res.send({ error: false, data: result, message: message });
        })
    }



})


app.listen(3000, () => {
    console.log('Node App is running on port 3000')
})

module.exports = app;
