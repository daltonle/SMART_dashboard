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

### Get all air sensors

Retrieves list of air sensors and their co-ordinates.

#### HTTP Request

`GET http://localhost:5000/sensors/air`

#### Parameters

None.

#### Return

An array of sensor objects containing id and coordinates.

**Sample response**

```json
[
    {
    	"id": "70B3D5499FE5C1AE",
		"lat": "0.0",
		"long": "0.0",
		"alt": "0.0"
	},
    {
    	"id": "70B3D54995817F4C",
		"lat": "0.0",
		"long": "0.0",
		"alt": "0.0"
	}
]
```

### Retrieve all visual sensors

Retrieves list of visual sensors and their co-ordinates.

#### HTTP Request

`GET http://localhost:5000/sensors/visual`

#### Parameters

None.

#### Return

An array of sensor objects containing id and coordinates.

### Retrieve an air sensor by ID

#### HTTP Request

`GET http://localhost:5000/sensors/air/{id}`

#### Parameters

- **id**: id string

#### Return

**Sample response**

```json
{
    "id": "70B3D5499FE5C1AE",
    "lat": "0.0",
    "alt": "0.0",
    "name": "aq_03",
    "description": "",
    "long": "0.0",
    "pm10": "4",
    "pm2_5": "3",
    "ts": "2018-11-07T23:54:03.419Z"
}
```

### Retrieve a visual sensor by ID

#### HTTP Request

`GET http://localhost:5000/sensors/visual/{id}`

#### Parameters

- **id**: id string

#### Return

**Sample response**

```json
{
    "id": "MAC-00-04-4b-c4-89-2b",
    "lat": "0.0",
    "alt": "0.0",
    "name": "MAC-00-04-4b-c4-89-2b",
    "description": "",
    "mode": "fixed",
    "long": "0.0",
    "ts": "2019-01-31T04:27:06.727Z",
    "pedestrians": "0",
    "vehicles": "0",
    "bicycles": "0",
    "reso_x": null,
    "reso_y": null,
    "ip": null,
    "cpu_usage": null,
    "memory_usage": null,
    "disk_usage": null,
    "temp": null,
    "uptime": null
  }
```

### Retrieve an air sensor by coordinates

#### HTTP Request

`GET http://localhost:5000/sensors/air/{long}.{lat}.{alt}`

#### Parameters

- **long**: longitude
- **lat**: latitude
- **alt**: altitude

#### Return

A JSON object with the air sensor info.

### Retrieve a visual sensor by coordinates

#### HTTP Request

`GET http://localhost:5000/sensors/visual/{long}.{lat}.{alt}`

#### Parameters

- **long**: longitude
- **lat**: latitude
- **alt**: altitude

#### Return

A JSON object with the visual sensor info.

### Retrieve air quality data of a sensor

#### HTTP Request

`GET http://localhost:5000/sensor-data/air/{id}`

#### Parameters

- **id**: id string

#### Return

Array of data collected and timestamps.

**Sample response**

```json
[
  {
    "pm2_5": 18,
    "pm10": 36,
    "to_char": "07-11-2018 12:11:21"
  },
  {
    "pm2_5": 21,
    "pm10": 25,
    "to_char": "07-11-2018 12:11:28"
  }
]
```

### Retrieve air quality data around a timestamp

#### HTTP Request

`GET http://localhost:5000/sensor-data/air/{year}-{month}-{day}`

#### Parameters

- **year, month, day**: chosen date

#### Return

Array of data collected from 15 days prior up until 15 days after the chosen date.

### Retrieve visual data of a sensor

#### HTTP Request

`GET http://localhost:5000/sensor-data/visual/{id}`

#### Parameters

- **id**: id string

#### Return

Array of data collected and timestamps.

### Retrieve visual quality data around a timestamp

#### HTTP Request

`GET http://localhost:5000/sensor-data/visual/{year}-{month}-{day}`

#### Parameters

- **year, month, day**: chosen date

#### Return

Array of data collected from 15 days prior up until 15 days after the chosen date.