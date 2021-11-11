const CryptoJS = require('crypto-js');
const express = require('express');
const router = express.Router();
const axios = require('axios');

let la = 'https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data/la';
let all = 'https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data/?rcn=4';

const oM2MHeaders = {
    'Connection': 'keep-alive',
    'Accept': 'application/json',
    'X-M2M-Origin': 'lV2tfIWL8r:DPiZn9pxhA',
    'Content-Type': 'application/json;ty=4',
};

router.get('/', (req, res) => {
    res.json({ msg: 'running' });
});

router.get('/getLatest', (req, res) => {
    console.log('getting latest')
    axios.get(la, { headers: oM2MHeaders }).then(r2 => {

        //decryption here

        let raw = r2.data['m2m:cin']['con'];

        raw = decrypt(raw);

        raw = raw.split(',');
        let ints = raw.map(i => Number(i));
        console.log(ints);
        let ret = {
            'time': ints[0],
            'ph': ints[1],
            'tds': ints[2],
            'turb': ints[3],
            'orp': ints[4],
            'temp': ints[5],
        }
        return res.json({ 'data': ret });

    })
});

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
    raw = raw.split(',');
    let ints = raw.map(i => Number(i));
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

router.get('/getAll', (req, res) => {
    console.log('getting latest');
    axios.get(all, { headers: oM2MHeaders }).then(r2 => {
        console.log(r2.data['m2m:cnt']['m2m:cin']);
        let ret = r2.data['m2m:cnt']['m2m:cin'];
        ret = ret.slice(-50);

        ret = ret.map(function(each) {
            return extract(each['con']);
        });

        return res.json({ 'data': ret });
    });
});

module.exports = router;
