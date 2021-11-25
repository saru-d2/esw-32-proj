const CryptoJS = require('crypto-js');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment')

let la = 'https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data/la';
let all = 'https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data/?rcn=4';
let ts = 'https://api.thingspeak.com/channels/635029/feeds.json?api_key=Q82IJ6IH3GWTD09S&results=50'

const oM2MHeaders = {
    'Connection': 'keep-alive',
    'Accept': 'application/json',
    'X-M2M-Origin': 'lV2tfIWL8r:DPiZn9pxhA',
    'Content-Type': 'application/json;ty=4',
};



function decrypt(ciphertext) {
    const base64_iv  = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const iv  = CryptoJS.enc.Hex.parse(base64_iv);

    const AESKey = '2B7E151628AED2A6ABF7158809CF4F3C';
    const key = CryptoJS.enc.Hex.parse(AESKey);

    // Decrypting
    const bytes  = CryptoJS.AES.decrypt( ciphertext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });
    const plaintext = bytes.toString(CryptoJS.enc.Base64);
    const decoded_b64msg =  new Buffer(plaintext, 'base64').toString('ascii');

    console.log("Decrypted message: ", decoded_b64msg);
    
    return decoded_b64msg;
}



function extract(raw) {
    raw = raw.replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, '').split(',');
    let ints = raw.map(i => Number(i.split('\\x')[0]));
    console.log(raw)
    console.log(ints)
    let ret = {
        'time': ints[0],
        'ph': ints[1],
        'tds': ints[2],
        'turb': ints[3],
        'orp': ints[4],
        'temp': ints[5],
    };
    return ret;
}

function extractTS(raw) {
    ret = {
        'time': moment(raw['created_at']).utcOffset('+0530').format('YYYYMMDDHHmmss'),
        'field1': raw['field1'],
        'field2': raw['field2'],
        'field3': raw['field3'],
        'field4': raw['field4'],
        'rawTime': raw['created_at'],
    }

    return ret
}

router.get('/', (req, res) => {
    res.json({ msg: 'running' });
});

router.get('/getLatest', (req, res) => {
    console.log('getting latest')
    axios.get(la, { headers: oM2MHeaders }).then(r2 => {

        //decryption here

        let raw = r2.data['m2m:cin']['con'];

        raw = decrypt(raw);

        ret = extract(raw)
        return res.json({ 'data': ret });

    })
});

router.get('/getAll', (req, res) => {
    console.log('getting latest');
    axios.get(all, { headers: oM2MHeaders }).then(r2 => {
        console.log(r2.data['m2m:cnt']['m2m:cin']);
        let ret = r2.data['m2m:cnt']['m2m:cin'];
        ret = ret.slice(-50);

        ret = ret.map(function(each) {

            return extract(decrypt(each['con']));
        });

        return res.json({ 'data': ret });
    });
});

router.get('/getThingspeakFieldNames', (req, res) => {
    console.log('fetching from thingspeak')
    axios.get(ts).then(r2 => {
        console.log(r2)
        ret = {
            field1: r2['data']['channel']['field1'],
            field2: r2['data']['channel']['field2'],
            field3: r2['data']['channel']['field3'],
            field4: r2['data']['channel']['field4'],
        }
        return res.json({'data': ret})
    })
})

router.get('/getThingspeak', (req, res) => {
    console.log('fetching from thingspeak')
    axios.get(ts).then(r2 => {
        console.log(r2)
        r3 = r2['data']['feeds']
        ret = r3.map(function(each) {
            return extractTS(each);
        })
        return res.json({'data': ret})
    })
})

module.exports = router;
