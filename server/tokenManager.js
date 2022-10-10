const jwt = require('jsonwebtoken');

class tokenManager {

    constructor() {
        this.logins = new Map();
    }

    verifyLogins() {
        try {
            this.logins.forEach((_, refreshToken) => {
                if(!jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)) {
                    this.deleteToken(refreshToken);
                    console.log(`deleted token: ${this.deleteToken}\n`);
                    console.log(this.logins);
                }
            })    
        } catch (error) {
            console.log(error)
        }
        
    }

    generateAccessToken(id, email, role = 'USER') {
        const payload = { id, email, role };

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFE});
    }

    generateRefreshToken(id, email, role = 'USER') {
        const payload = { id, email, role }

        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFE});

        this.logins.set(refreshToken, payload);

        console.log(this.logins);

        return refreshToken;
    }

    refreshTokens(refresh) {
        const user = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);

        const token = this.generateAccessToken(user.id, user.email, user.role, process.env.ACCESS_TOKEN_SECRET);
        const refreshToken = this.generateRefreshToken(user.id, user.email, user.role, process.env.REFRESH_TOKEN_SECRET);

        this.logins.set(refreshToken, this.deleteToken(refresh));

        console.log(this.logins);

        return { token, refreshToken };
    }

    deleteToken(refresh) {
        const about_user = this.logins.get(refresh);
        this.logins.delete(refresh);

        console.log(this.logins);

        return about_user;
    }
}

// const logins = new Map();

// const tokenManager = () => {

// }

module.exports = new tokenManager();