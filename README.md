# HenryHome-Back
This is the repository of the backend of "Henry Home", this is a web application that connect the owner of an accommodation to the users who wish to rent them.

### Requirements 📋

1. You will need to create a DB in mongoDB
2. Create an .env file
3. Create an environment variable "MONGODB_URI" where you have to complete with the URI provide in the connect section when creating the DB

```
MONGODB_URI= YOUR_MONGODB_URI
```
4.



## Installation 🔧

Use the package manager npm to install

```
npm install 
```


## Run Local⚙️

```
npm run dev 
```
# ROUTES

(*) = required 

## `USERS`

Routes related to the users

#### `POST` 

```http
  POST /api/user/login : Logs user into the system
```
Login receives: (body)
```javascript
{
     *email:"jujujuju@gmail.com", 
     *inputPassword:"pepe2",
     *role://Client, Admin, Moderator
}
```
And returns the user information along with its token



```http
  POST /api/user/register : Creates a new user
```
Register receives: (body)

```javascript
  {
    *email:"example@gmail.com",
    *inputPassword: "blabla",
    *confirmPassword:"blabla",
    *firstName:"Pedro", 
    *lastName:"Peyon",
    *role://Client, Admin, Moderator
}
```
And returns the user information along with its token

#### `GET`

```http
  GET /api/user/:id/:role
```
Returns the user information


```http
  GET /api/user/password
```
Change password receives: (body)
```javascript
{ 
 *email:"ejemplo@gmail.com",
 *newPassword: "blabla",
 *role://Client, Admin, Moderator
}
```
---------------

## `HOUSES`

Routes related to the houses

#### `GET`

```http
  GET /api/houses : Gets all houses
```
Query= page & size to pagination
defaults= page=1 size=10

to filters use body:
```javascript
{ 
 minPrice: 300, // minPrice dont need maxPrice to work
 maxPrice: 600, // maxPrice dont need minPrice to work
 location: "Santa Cruz",
 stars: 3, // minStar value
 numberOfPeople: 3,
 numberOfBeds: 2,
 status: "Pending"
}
```



```http
  GET /api/houses/:id : Finds houses by ID
```




#### `POST`

```http
  POST /api/houses : Creates a new house
  
```
Post House receives: (body)

```javascript
 {
    *"name": "Hobbiton",
    *"pricePerNight": 5,
    *"numberOfPeople": 3,
    "description": "Hello",
    "houseRules": "Hello",
    "services": ["pool"],
    "facilities": ["tv", "wifi"],
    "location": 7,
    "images": ["https://farm6.staticflickr.com/5492/14576186774_c28c3e308c_z.jpg"]
  }
```

#### `PATCH`

```http
  PATCH /api/houses : Updates an existing house
```
Patch House receives: (body)
```javascript
 {
    "name": "Hobbiton",
    "pricePerNight": 5,
    "numberOfPeople": 3,
    "description": "Hello",
    "houseRules": "Hello",
    "services": ["pool"],
    "facilities": ["tv", "wifi"],
    "location": 7,
    "images": ["https://farm6.staticflickr.com/5492/14576186774_c28c3e308c_z.jpg"]
  }
```

```http
  PATCH /api/houses/status : Updates the state of a house /admins 
```
Patch house status receives (body)
```javascript
{ 
*status,
*id 
}
```

#### `DELETE`

```http
  DELETE /api/houses : Deletes a house
```
Receives *id* (body)

------------

## `FACILITIES`

Routes related to the facilities

#### `GET`

```http
  GET /api/facilities : Gets all facilities
```

#### `POST`

```http
  POST /api/facilities : Creates a new facility
```
Recieves *name* (body)

--------------

## `SERVICES`

Routes related to the services

#### `GET`

```http
  GET /api/services : Gets all services
```

#### `POST`

```http
  POST /api/facilities : Creates a new service
```
Recieves *name* (body)

------

## `LOCATION`

Routes related to the locations

#### `GET`

```http
  GET /api/locations : Gets all the locations
```

## `Reservation`
#### `POST` 
```http
  Post /api/reservation
```
Recieves: (body)
```javascript
{
    *id_hotel:4d88b591-e7cb-4647-bfa1-d101ea435185",
    *date_start:"2015-09-10",
    *date_end:"2015-10-15",
}
```
#### `PUT` 
```http
  Put /api/reservation : Change status to Resolved
```
Recibes the *id* of the reservation (body)

--------------

## `Reviews`
#### `POST` 
```http
  Post /api/reviews
```
Post Review receives (body)
```javascript
{ 
    *stars:3, // 1-5 
    *id_hotel:"d98f73a5-0d0e-470a-97fe-0335aa89d911",
    "description": "Holaquetal",
    
    
    }

```
#### `PATCH` 
```http
  Patch /api/reviews
```
Patch Review receives (body)
```javascript
{ 
    stars:3, // 1-5 
    description: "Holaquetal",
    *id:"034103ab-3423-4702-ac6d-512548a498c7" // review id
    }

```
#### `DELETE` 
```http
  Delete /api/reviews
```

Delete Review receives (body)
```javascript
{ 
    *id:"034103ab-3423-4702-ac6d-512548a498c7" // review id
}

```


## Deploy 🚀
You will have to deploy the dist file

Enjoy 😊
