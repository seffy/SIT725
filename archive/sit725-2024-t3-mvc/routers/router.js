let express = require('express');
let router = express.Router();
let controller = require('../controllers/controller');

router.post('/', function(req,res){
    controller.postThoughts(req,res);
});

router.get('/', (req,res)=>{
    controller.getAllThoughts(req,res);
});

router.delete('/', (req,res)=>{
    controller.getAllThoughts(req,res);
});


module.exports = router;