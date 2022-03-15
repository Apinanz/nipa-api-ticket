# nipa-official-api-ticket-docs

# Table of contents
* Base URL
* Endpoint type
* Constructing the request
* API Documentation
* Error codes

# Base URL
* The base URL is:

# Endpoint types
### Non-secure endpoints
All non-secure endpoints do not need authentication and use the method GET.
* GET /api/tickets
* GET api/tickets/filter/:status
* POST /api/tickets/create
* PUT /api/tickets/edit

# Constructing the request
### GET/POST/PUT request
* GET requests require parameters as query string in the URL (e.g. ?status-sort=ASC).
* POST requests require x-www-form-urlencoded.
* PUT requests require x-www-form-urlencoded or parameters as query string in the URL (e.g. ?id=2&title=Nipa).

# API Documentation
Refer to the following for description of each endpoint

### GET /api/tickets
#### Description:
Get endpoint status. When error is true, it is highly recommended to wait until the error changes back to false.

#### Response:
```json
{
    "error": false,
    "data": [
        {
            "id": 1,
            "title": "Nipa-intern",
            "description": "Back-end Developer ",
            "status": "pending",
            "contact": {
                "name": "Natthavut",
                "lastname": "Apinantakun",
                "address": "SU ",
                "telephone": "0843384584",
                "email": "Yoojongdee_s@silpakorn.edu"
            }
            "created_at": "03/12/2022, 17:14:57",
            "last_update": "03/13/2022, 16:37:55"
        }
    ]
    "message": "Successfully retrieved all tickets"
}
```
### GET /api/tickets
#### Description:
Get ticker information by sort
#### Query:

Parameter | Argument | 
----------|----------|
status-sort | ASC , DESC
last-update-sort | ASC , DESC

#### Annotation:
Can sort them together.

#### Response:
* status-sort
``` json
{
    "error": false,
    "data": [
        {
            "id": 1,
            "title": "Nipa-intern",
            "description": "Back-end Developer ",
            "status": "pending",
            "contact": {
                "name": "Natthavut",
                "lastname": "Apinantakun",
                "address": "SU ",
                "telephone": "0843384584",
                "email": "Yoojongdee_s@silpakorn.edu"
            },
            "created_at": "03/12/2022, 17:14:57",
            "last_update": "03/13/2022, 16:37:55"
        },
        {
            "id": 4,
            "title": "Nipa-Intren",
            "description": "Dev-ops Developer ",
            "status": "pending",
            "contact": {
                "name": "Supakarn",
                "lastname": "Yoojongdee",
                "address": "SU ",
                "telephone": "0632247712",
                "email": "Yoojongdee_s@silpakorn.edu"
            },
            "created_at": "03/12/2022, 21:50:39",
            "last_update": "03/12/2022, 21:50:39"
        }
    ]
    "message": "Successfully retrieved all tickets"
}
```

* last-update-sort
``` json
{
    "error": false,
    "data": [
        {
            "id": 2,
            "title": "Nipa-intern",
            "description": "Front-end Developer ",
            "status": "resolved",
            "contact": {
                "name": "Anupap ",
                "lastname": "Tubtimsan",
                "address": "SU ",
                "telephone": "0835546645",
                "email": "apinantakun_n@silpakorn.edu"
            },
            "created_at": "03/12/2022, 21:47:46",
            "last_update": "03/15/2022, 17:36:10"
        },
        {
            "id": 3,
            "title": "Nipa-intern",
            "description": "Dev-ops Developer ",
            "status": "resolved",
            "contact": {
                "name": "Tanawat",
                "lastname": "Yuwansiri",
                "address": "BKK",
                "telephone": "0854367453",
                "email": "Yoojongdee_s@silpakorn.edu"
            },
            "created_at": "03/12/2022, 21:49:20",
            "last_update": "03/13/2022, 21:45:36"
        }
    ]
    "message": "Successfully retrieved all tickets"
}
```

* status-sort and last-update-sort
``` json
{{
    "error": false,
    "data": [
        {
            "id": 1,
            "title": "Nipa-intern",
            "description": "Back-end Developer ",
            "status": "pending",
            "contact": {
                "name": "Natthavut",
                "lastname": "Apinantakun",
                "address": "SU ",
                "telephone": "0843384584",
                "email": "Yoojongdee_s@silpakorn.edu"
            },
            "created_at": "03/12/2022, 17:14:57",
            "last_update": "03/13/2022, 16:37:55"
        },
        {
            "id": 5,
            "title": "Nipa-Intren",
            "description": "Dev-ops Developer ",
            "status": "pending",
            "contact": {
                "name": "Thatchaphon",
                "lastname": "Orsuwan",
                "address": "SU ",
                "telephone": "0845367452",
                "email": "Orsuwan_t@silpakorn.edu"
            },
            "created_at": "03/12/2022, 21:52:35",
            "last_update": "03/12/2022, 21:52:35"
        }   
    ]
    "message": "Successfully retrieved all tickets"
}
```



### GET api/tickets/filter/:status
#### Description: 
Get ticket by filter tickets using status (pending, accepted, solved, rejected)
#### Response:
``` json
{
    "error": false,
    "data": [
        {
            "id": 1,
            "title": "Nipa-intern",
            "description": "Back-end Developer ",
            "status": "pending",
            "name": "Natthavut",
            "lastname": "Apinantakun",
            "address": "SU ",
            "telephone": "0843384584",
            "email": "Yoojongdee_s@silpakorn.edu",
            "created_at": "2022-03-12T10:14:57.000Z",
            "last_update": "2022-03-13T09:37:55.000Z"
        }
    ]
    "message": "Successfully retrieved ticket data when status is pending"
}
```
### POST /api/tickets/create
#### Description: 
Create a new ticket with these pieces of information : title,description, contact information, created timestamp, lastst ticket update timestamp.
#### Query:
Parameter | Argument | 
----------|----------|
titel | String
description | String
name | String
lastname | String
address | String
telephone | String (telephone format)
email | String (email format)

#### Response:
``` json
{
    "error": false,
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 6,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    },
    "message": "Ticket successfully added"
}
```

### PUT /api/tickets/edit
#### Description: 
Update a ticket's information and status
#### Query:
id | int
titel | String
description | String
name | String
lastname | String
address | String
telephone | String (telephone format)
email | String (email format)
status | String (pending, accepted, solved, rejected)

#### Annotation:
Can update specific information that needs to be updated.

#### Response:
``` json
{
    "error": false,
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
        "protocol41": true,
        "changedRows": 1
    },
    "message": "Ticket successfully status update"
}
```
