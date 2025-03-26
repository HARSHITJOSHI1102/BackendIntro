const User = require("../models/user")

async function handleGetAllUsers(req, res) {
    const allDbUsers = await User.find({})
    return res.json(allDbUsers)
}

async function handlegetUserById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User Not" })
    return res.json(user);
}

async function handleUpdateUserById(req, res) {

    await User.findByIdAndUpdate(req.params.id, { last_name: "Jake" })
    return res.status(201).json({ status: "success", });

}

async function handleDeleteUserById(req, res) {
    await User.findByIdAndDelete(req.params.id)
    return res.json({ status: "Success" });
}

async function handleCreateNewUser(req, res) {
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
    return res.status(201).json({ msg: "Success",id:result._id });

}
module.exports = {
    handleGetAllUsers,
    handlegetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser
}