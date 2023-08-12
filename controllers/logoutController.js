const User = require('../model/User');

const handleLogout = async (req, res) => {
    //on client also delete de access token


    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    //Is refresh token in DB

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204);
    }
    //Delete the refresh token in DB
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });//IN PRODUCTION=>secure:true -only serves on https
    res.sendStatus(204);
}

module.exports = { handleLogout }