import {sign, verify} from 'jsonwebtoken';

interface AuthData {
    _id: string;
    email: string
}

export const generateToken = (secret: string) => {
    // generate JWT
    return (data: AuthData) => {
        return new Promise<string>((res, rej) => {
            res(sign({...data}, secret, {
                expiresIn: '5d'
            }))
        })
    }
}

export const verifyToken = (secret: string) => {
    // verify JWT
    return (token: string) => {
        return new Promise<AuthData>((res, rej) => {
            verify(token, secret, function(err, decoded) {
                if(err) rej(err)
                res(decoded as AuthData)
            })
        })
    }
    
}