import * as mongoose from 'mongoose' ;

export const UserSchema = new mongoose.Schema({
    first_name: {type: String, required:true},
    last_name: {type: String, required:true},
    email: {type: String, required:true},
    hash_password: {type: String, required:true},
    createdAt: {type: Date, required:true},

})


export interface User  {
    first_name: string ,
    last_name: string ,
    email: string,
    hash_password: string,
    createdAt: Date,
}

