// ------------------ Node.js Code to Host Range-Gettable Remote Datasets ------------------
// We need to be able to save annotations from multiple people and compare them for agreement! 


import express        from 'express'
import bodyParser     from 'body-parser'
import cookieParser   from 'cookie-parser'
import path           from 'path'

import config         from './static/config.js'
import defaultroutes  from './routes/default.js'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app           = express();

app.use(bodyParser.json());
app.use(cookieParser())

/* ----- serve static ----- */
app.use(express.static(path.join(__dirname, 'static')));

app.use('/', defaultroutes)
// app.use('/password', passwordauth)
// app.use('/webauthn', webuathnauth)

const port = config.port || 3000;
app.listen(port);
console.log(`Started app on port ${port}`);

export default app;
