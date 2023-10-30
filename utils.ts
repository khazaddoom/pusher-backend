import {sign, verify} from 'jsonwebtoken';

export const generateToken = (secret: string) => {
    // generate JWT
    return (data: any) => {
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
        return new Promise((res, rej) => {
            verify(token, secret, function(err, decoded) {
                if(err) rej(err)
                res(decoded)
            })
        })
    }
    
}