import jwt from 'jsonwebtoken';
import config from '../../../data.js';
const SECRET = config.SECRET;
export function generateToken(user) {
    const token = jwt.sign({user}, SECRET, {expiresIn:'24h'});
    return token
}