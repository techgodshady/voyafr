import express from 'express';
import pool from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {jwtTokens} from '../utils/jwt-helpers.js';

const router = express.Router();

router.post('/login', async (req, res)=>{
    try{
        const {email,password} = req.body;
        const users = await pool.query('SELECT * FROM users WHERE user_email = $1',[email]);
        if(users.rows.length === 0) return res.status(401).json({error : "Email is incorrect"});
        //PASSWORD CHECK
        const validPassword = await bcrypt.compare(password,users.rows[0].user_password); 
        if(!validPassword) return res.status(401).json({error:"Incorrect password"});
        //
        let tokens = jwtTokens(users.rows[0]);
        res.cookie('refresh_token',tokens.refreshToken,{httpOnly:true});
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});


router.get('/refresh_token',(req,res) => {
    try{
        const refreshToken = req.cookies.refresh_token;
    comsole.log(refreshToken);
    }catch (error) {

    }
})

export default router;