let collection = require('../models/thoughts');

const postThoughts = (req,res) => {
    let thoughts = req.body;
    collection.postThoughts(thoughts, (err,result) => {
        if (!err) {
            res.json({statusCode:201,data:result,message:'success'});
        }
    });
}

const getAllThoughts = (req,res) => {
    collection.getAllThoughts((error,result)=>{
        if (!error) {
            res.json({statusCode:200,data:result,message:'success'});
        }
    });
}

const deleteThoughts = (req,res) => {
    let cat = req.body;
    collection.deleteOne(thoughts, (err,result) => {
        if (!err) {
            res.json({statusCode:201,data:result,message:'success'});
        }
    });
}

module.exports = {postThoughts,getAllThoughs}