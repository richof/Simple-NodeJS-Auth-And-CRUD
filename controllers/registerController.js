const User = require('../model/User');
const bcrypt = require('bcrypt');

const handlerNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'UserName and Passsword required' });
    //check for duplicate usernames in the daabase
    const duplicate = await User.findOne({ username: user }).exec();

    if (duplicate) return res.sendStatus(409);
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //create and store the new user
        const result = await User.create({
            "username": user,           
            "password": hashedPwd
        });
        
        //Alternative for creating user
        // const newUser= new User();
        // newUser.username=user;
        // const result= await newUser.save();

       console.log(result);

        res.status(201).json({ 'success': `New user ${user} was created` });
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500).json({ 'message': err.message });
    }
}
module.exports = { handlerNewUser };