const express = require("express")
const fs = require("fs")
const users = require('./MOCK_DATA.json');
const { error } = require("console");
const { default: mongoose } = require("mongoose");
const { type } = require("os");
const app = express();
const PORT = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/Harshit-app-1').then(()=>{
console.log("MongoDb Connected")
})
.catch(err =>{
    console.log("Mongo Error",err)
})
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
    },
    email: {
        type: String,
        required:true,
        unique:true,
    },
    job_title:{
        type:String,
    },
    gender:{
        type:String,
    },
},{timestamps:true}
);

const User = mongoose.model('user',userSchema)

app.use(express.urlencoded({ extended: false }));


// Middleware are used as a plugin to carry out the request
app.use((req, res, next) => {
    fs.appendFile('log.txt', `${Date.now()}:${req.method}:${req.path}\n`, (err, data) => {
        next();
    })
})


//Routes
app.get('/api/users', (req, res) => {
    res.setHeader("X-My-Name", "Harshit Joshi")
    // Always Add X in custom headers
    console.log(req.headers)
    // console.log("I am in get route",req.myUserName)
    return res.json(users);
})
app.get('/users', (req, res) => {
    const html = `
<ul>
${users.map((user) => `<li>${user.first_name}</li>`).join("")}
</ul>`;
    res.send(html);
})
app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => (user.id === id))
        if (!user) return res.status(404).json({ error: "User Not" })
        return res.json(user);
    }).patch((req, res) => {
        const id = Number(req.params.id);
        const user = users.find(user => user.id === id);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Update only the fields provided in the request body
        Object.assign(user, req.body);

    }).delete((req, res) => {
        const id = Number(req.params.id);
        const user = users.findIndex(user => user.id === id)
        if (user === -1) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        users.splice(user, 1);
        res.status(200).json({ status: "success" });
    })
app.post("/api/users", async(req, res) => {
    const body = req.body;
    if (!body || !body.first_name || !body.email || !body.gender || !body.last_name || !body.job_title) {
        return res.status(400).json({ msg: "All Feilds Are Required" })
    }
const result = await User.create({
    first_name: body.first_name,
    last_name:body.last_name,
    email:body.email,
    gender:body.gender,
    job_title:body.job_title,
}
);
console.log(result);
return res.status(201).json({msg:"Success"});
    // users.push({ ...body, id: users.length + 1 })
    // // fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err ,data)=>{
    // //     return res.json({status:"success",id: users.length });
    // // })   
    // fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
    //     if (err) {
    //         return res.status(500).json({ status: "error", message: "Error writing to file" });
    //     }
    //     return res.json({ status: "success", message: "User deleted successfully" });
    // });
})
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`))