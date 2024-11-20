var express = require("express")
var app = express()
app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var port = process.env.port || 3000;

// POST method 
app.post("/multiply", (req, res) => {
    const n1 = parseInt(req.body.n1); 
    const n2 = parseInt(req.body.n2); 

    if (isNaN(n1) || isNaN(n2)) {
        return res.send('<style>body{background:#0b7161;color:#fafafa;}</style><div style="font-family:Arial; font-weight: bold; font-size: 24px; width:450px; margin:0 auto; text-align: center"><div style="margin-top:25%;"><div style="font-size:30px; "><p>Invalid! <br>Please enter numbers only.</p></div></div><a href="/" style="padding: 12px 25px; text-decoration:none; background-color: #2196F3; color: white; border: 2px solid #2196F3; border-radius: 5px; font-size: 16px;">Go back</a></div>')
    }

    const result = n1 * n2;
    res.send('<style>body{background:#0b7161;color:#fafafa;}</style><div style="font-family:Arial; font-weight: bold; font-size: 24px; width:350px; margin:0 auto; text-align: center"><div style="margin-top:25%;">The result is:<div style="font-size:160px; ">'+result+'</div></div><a href="/" style="padding: 12px 25px; text-decoration:none; background-color: #2196F3; color: white; border: 2px solid #2196F3; border-radius: 5px; font-size: 16px;">Go back</a></div>')
});

app.listen(port,()=>{
    console.log("App listening to: "+port)
    })