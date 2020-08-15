## Package to create an Node.js web server based on express
The package's purpose is to offer a foundation for express based web apps,
with general, none functional behaviour regarding security, logging and
performance beeing integrated.

### install
```
npm i @pubcore/node-server-docker
```

### Example
```
'use strict'
const {app} = require('@pubcore/node-server-docker')
app.use((req, res) => res.send('Hello world!'))
```

### Configuration environment variables with (default) value
* APP_PORT (0)
Application's ports
* NODE_ENV (production)
Type of environment, either 'development' or 'production'
* RATE_WIN (3000), RATE_MAX (300), RATE_DELAY (0)
Rate limit values, see https://www.npmjs.com/package/express-rate-limit
* TLS_KEY_DIR (/run/secrets)
Path to the place where the TLS (SSL) key files for used domain are located.
Required files: ssl-key, ssl-cert, ssl-dhparam
* TLS_KEY_SOURCE (FILES)
If set to "devcert" and corresponding npm package is installed, it is used to
auto-generate a selfsigned certificate for localhost. Only in development mode
possible (NODE_ENV == "development").

* TOOBUSY_ENABLED (0), TOOBUSY_MAX_LAT (300), TOOBUSY_INTERVALL (1500)
https://www.npmjs.com/package/toobusy-js
* HTTP (false) If set to "true" TLS is disabled (not recommended)