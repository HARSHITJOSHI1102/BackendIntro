const express = require("express")
const fs = require("fs")
const users = require('./MOCK_DATA.json')
const app = express();
const PORT = 8000;


app.use(express.urlencoded({extended:false}));


// Middleware are used as a plugin to carry out the request
app.use((req,res ,next)=>{
  fs.appendFile('log.txt',`${Date.now()}:${req.method}:${req.path}\n`,(err,data)=>{
    next();
  })
})


//Routes
app.get('/api/users',(req,res)=>{
    console.log("I am in get route",req.myUserName)
    return res.json(users);
})
app.get('/users',(req,res)=>{
const html = `
<ul>
${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
</ul>`;
res.send(html);
})
app.route('/api/users/:id')
.get((req,res)=>{
   const id = Number(req.params.id);
   const user = users.find(user=>(user.id === id))
   return res.json(user);
}).patch((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }

    // Update only the fields provided in the request body
    Object.assign(user, req.body);

}).delete((req,res)=>{
    const id = Number(req.params.id);
    const user = users.findIndex(user => user.id === id)
    if (user === -1) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    users.splice(user, 1);
    res.status(200).json({status:"success"});
})
app.post("/api/users",(req,res)=>{
    const body = req.body;
    users.push({...body ,id: users.length+1})
    // fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err ,data)=>{
    //     return res.json({status:"success",id: users.length });
    // })   
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Error writing to file" });
        } 
        return res.json({ status: "success", message: "User deleted successfully" });
    });
})
app.listen(PORT,() =>console.log(`Server Started at PORT:${PORT}`))