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

