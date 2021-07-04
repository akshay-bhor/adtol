const { OAuth2Client } = require('google-auth-library');

module.exports = async (req, res, next) => {
    try {
        if(!req.body.gToken) {
            req.body.gid = null;
            return next();
        }
        // Token
        const gToken = req.body.gToken;
        
        // Init Google OAuth
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        // Verify token
        const userObj = await client.verifyIdToken({
            idToken: gToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = userObj.getPayload();

        // Attach payload to body
        req.body.gid = payload['sub'];
        req.body.mail = payload['email'];
        req.body.name = payload['given_name'];
        req.body.surname = payload['family_name'];
       
        next();

    } catch (err) {
        if(err.statusCode)
            err.statusCode = 500;
        next(err);
    }
}