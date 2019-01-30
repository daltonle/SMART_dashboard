# SMART_air project

A dashboard displaying air quality data collected from sensors across Wollongong and Sydney, using Node.js, Express.js, React and PostgreSQL.

## Quick start

### Install dependencies

```powershell
# server dependencies
npm install

# client dependencies
npm run client-install
```

### Create `.env` file with credentials in root directory

```
PGUSER=dbuser
PGHOST=database.server.com
PGPASSWORD=secretpassword
PGDATABASE=mydb
PGPORT=3211
```

### Start

```powershell
# run server and client concurrently
npm run dev
```

## API Endpoints

### Get all sensors

Retrieves list of sensors and their co-ordinates.

#### HTTP Request

`GET http://localhost:5000/sensors/`

#### Parameters

None.

#### Return

An array of sensor objects containing id and coordinates.

**Sample response**

```json
[
    {
    	"id": "70B3D5499FE5C1AE"
		"lat": "0.0"
		"long": "0.0"
		"alt": "0.0"
	},
    {
    	"id": "70B3D54995817F4C"
		"lat": "0.0"
		"long": "0.0"
		"alt": "0.0"
	}
]
```

### Retrieve a sensor by ID

#### HTTP Request

`GET http://localhost:5000/sensors/{id}`

#### Parameters

- id: id string

#### Return



### Retrieve a sensor by coordinates

#### HTTP Request

`GET http://localhost:5000/sensors/{long}.{lat}.{alt}`

#### Parameters

#### Return

### Retrieve air quality data of a sensor

#### HTTP Request

`GET http://localhost:5000/sensors/air-data/{id}`

#### Parameters

#### Return

### Retrieve visual data of a sensor

#### HTTP Request

`GET http://localhost:5000/sensors/visual-data/{id}`

#### Parameters

#### Return