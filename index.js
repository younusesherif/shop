const express = require('express');
const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb');

const app = express();


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

var publicDir = require('path').join(__dirname,'/');
app.use(express.static(publicDir));
app.engine('html', require('ejs').renderFile);

const uri = "mongodb+srv://younuse:sherif@cluster0-umi9i.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useUnifiedTopology: true,useNewUrlParser: true});

async function main(){

    try {
        await client.connect();
        console.log('connected');
    } 
    catch (e) {
        console.error(e);
    } 
}

main().catch(console.error); 

var pc = 1001;
app.get('/doc',async(req,res)=>{
    await client.db("new").collection("shop").find({},{_id:0}).toArray(function(err, result) {
        if (err)
        {
              console.log("invalid string");
        }
        else
        {
            res.json(result);
        }
    });
})
app.get('/',async(req,res)=>{
    await client.db("new").collection("shop").find({},{_id:0}).toArray(function(err, result) {
        if (err)
        {
              console.log("invalid string");
        }
        else
        {
            res.render(__dirname +'/first.html', {data: result});
        }
    });
})

app.get('/add',(req,res)=>{
    res.sendFile(__dirname + '/add.html');
})
app.post('/add',async(req,res)=>{
    const link = req.body.name;
    const act = req.body.act;
    const mrp = req.body.mrp;
    console.log(req.body);
    if(link!="" && act!="" && mrp!="")
        {
            console.log(link,act,mrp);
            await client.db("new").collection("shop").insertOne({pcode:pc,product:link,act:act,MRP:mrp});
            pc=pc+1;
            await console.log("data inserted");
            res.render(__dirname +'/alert.html', {data: "data added"});
        }
    else
        {
            res.send('<p>ENTER CORRECT DETAILS</p><br><a href="add.html"><button>back</button></a>');
        }
})
app.get('/edit',async(req,res)=>{
    res.sendFile(__dirname+'/edit.html');
})
app.post('/edit',async(req,res)=>{
    const id = parseInt(req.body.pcode);
    //const link = req.body.product;
    const act = req.body.act;
    const mrp = req.body.mrp;
    await client.db("new").collection("shop").update({"pcode" : id},{$set: {act:act,MRP:mrp}});
    await console.log("data changed");
    res.render(__dirname +'/alert.html', {data: "data Updated"});
})
client.close();
app.listen(process.env.PORT||3000, () => console.log(`server listening on port 3000!`))