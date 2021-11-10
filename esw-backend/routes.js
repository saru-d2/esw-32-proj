const express = require("express");
const router = express.Router();
const axios = require('axios')

let la = 'https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data/la'
let all = 'https://esw-onem2m.iiit.ac.in/~/in-cse/in-name/Team-32/Node-1/Data/?rcn=4'

const oM2MHeaders = {
    'Connection': 'keep-alive', 
    'Accept': 'application/json',
    'X-M2M-Origin': 'lV2tfIWL8r:DPiZn9pxhA',
    'Content-Type': 'application/json;ty=4',
}

router.get('/', (req, res) => {
    res.json({ msg: 'running' });
})

router.get('/getLatest', (req, res) => {
    console.log('getting latest')
    axios.get(la, {headers:oM2MHeaders}).then(r2 => {
        console.log(r2);

        //decryption here


        return res.json({'hey': r2.data['m2m:cin']})
    })
})


router.get('/getAll', (req, res) => {
    console.log('getting latest')
    axios.get(all, {headers:oM2MHeaders}).then(r2 => {
        console.log(r2.data['m2m:cnt']['m2m:cin'])
        return res.json({'hey': r2.data['m2m:cnt']['m2m:cin']})
    })
})
 
module.exports = router;
