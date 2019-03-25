# SMART Dashboard project

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

### Insert Google Maps API key in `/client/public/index.html`

```
<script src="https://maps.googleapis.com/maps/api/js?key=API_KEY"></script>
```

### Start

```powershell
# run server and client concurrently
npm run dev
```

