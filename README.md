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

Navigate to `localhost:3000` to see the app

## Technical Details

### Tech stack

#### Database
The database used is MongoDB. InfluxDB was also explored for the application as it is ideal for timeseries use case. MongoDB was preferred because of the ease to implement, ability to process/query timeseries data fairly good and affordability.
We used basic timeseries functionality like grouping and averaging based on granularity. There's an easy migration guide to move the data to full fledged time series database, but that won't be required because of flexibility and scalability that MongoDB offers.

Storing the data in the Mongo in the format

```
```

#### API/Middleware
Middleware was initially written Flask, but moved to Quart because of its outstanding support for ASGI which is asynchronous as well as websockets which may have a use case in the application at later stage.

There are 3 APIs:
- POST /metrics Add new metrics
- GET /metrics/average Get average of metrics
- GET /metrics/list List all available metric

A yaml spec is provided in `backend/metrics.yaml`. The spec is following swagger standards.

There's no kubernetes integration to the system.

#### Frontend
Frontend is written in react with `react-vis` package to visualize the timeline data. The UI is pretty basic with least amount of styling. For a better approach, it may be wise to do good amount of styling with a design system like Ant Design and use a powerful package like `d3.js` to show a chart or timeline data.

