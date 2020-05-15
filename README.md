## Package to create an Node.js web server based on express and docker
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
Default values (Window: 5 min, Max: 300, Delay: 0)
* TLS_KEY_DIR (/run/secrets)
Path to the place where the TLS (SSL) key files for used domain are located.
Required files: ssl-key, ssl-cert, ssl-dhparam
* TOOBUSY_ENABLED (0), TOOBUSY_MAX_LAT (300), TOOBUSY_INTERVALL (1500)
https://www.npmjs.com/package/toobusy-js

