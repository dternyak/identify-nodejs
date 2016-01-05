/* eslint no-console: 0 */
import express from 'express';
import webpack from 'webpack';
const port = 3000;
const app = express();
import useragent from 'express-useragent'
import jsonfile from 'jsonfile'
import util from 'util'

String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

const hash_dictionary = (dictionary) => {
    const new_string = JSON.stringify(dictionary);
    return new_string.hashCode()
};


app.get('/', function response(req, res) {
    const source = req.headers['user-agent'];
    let ua = useragent.parse(source);
    ua.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ua.screen = { // Get screen info that we passed in url post data
        width: req.param('width'),
        height: req.param('height')
    };

    const hash = hash_dictionary(ua);

    const file = 'data.json';

    jsonfile.readFile(file, function (err, obj) {

        if (!(hash in obj)) {
            obj[hash] = ua;

            jsonfile.writeFile(file, to_write, function (err) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end("YOU ARE NEW:" + hash);
            })
        } else {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end("HELLO AGAIN:" + hash);
        }


    });


})
;


app.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
