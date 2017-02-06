let express = require('express');
let app = express();

/**
 * Setup Application
 */
const portToUse = process.env.PORT || 3000;
app.listen(portToUse);
console.log('application listening on port', portToUse);

app.get('/', (req, res) => res.json({
    message: 'Welcome'
}));