# Obstime

## Getting started
The project has two folders: one for backend the other for frontend.

### Requirements
- Python3
- Node.js 16+

### How to run
- Backend
Create a .env file in backend folder with two environment variables
```
MONGO_CONNECTION_STRING=atlas_connection_string
```

Run
```
$ cd backend
$ pip install requirements.txt
$ quart --app main run
```

Or use virtual env
`venv\Scripts\activate`

- Frontend
```
$ cd obstine-frontend
$ npm i
$ npm run start
```

Navigate to localhost:3000