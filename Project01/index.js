const express = require("express")
const fs = require("fs")
// const users = require('./MOCK_DATA.json');
const { error } = require("console");
const { default: mongoose } = require("mongoose");
const { type } = require("os");
const app = express();
const PORT = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/Harshit-app-1').then(() => {
    console.log("MongoDb Connected")
})
    .catch(err => {
        console.log("Mongo Error", err)
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
        required: true,
        unique: true,
    },
    job_title: {
        type: String,
    },
    gender: {
        type: String,
    },
}, { timestamps: true }
);

const User = mongoose.model('user', userSchema)

app.use(express.urlencoded({ extended: false }));


// Middleware are used as a plugin to carry out the request
app.use((req, res, next) => {
    fs.appendFile('log.txt', `${Date.now()}:${req.method}:${req.path}\n`, (err, data) => {
        next();
    })
})


//Routes
app.get('/api/users', async (req, res) => {
    const allDbUsers = await User.find({})

    return res.json(allDbUsers);
})
app.get('/users', async (req, res) => {
    const allDbUsers = await User.find({})
    const html = `
<ul>
${allDbUsers.map((user) => `<li>${user.first_name} - ${user.email}</li>`).join("")}
</ul>`;
    res.send(html);
})
app.route('/api/users/:id')
    .get(async (req, res) => {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User Not" })
        return res.json(user);
    }).patch(async (req, res) => {
        await User.findByIdAndUpdate(req.params.id,{ last_name: "Jake" })
        return res.status(201).json({ status: "success", });
    }).delete(async(req, res) => {
       await User.findByIdAndDelete(req.params.id)
       return res.json({status:"Success"});
    })
app.post("/api/users", async (req, res) => {
    const body = req.body;
    if (!body || !body.first_name || !body.email || !body.gender || !body.last_name || !body.job_title) {
        return res.status(400).json({ msg: "All Feilds Are Required" })
    }
    const result = await User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender,
        job_title: body.job_title,
    }
    );
    console.log(result);
    return res.status(201).json({ msg: "Success" });
 
})
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`))