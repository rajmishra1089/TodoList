const express = require('express');

router = express.Router();

const {signUp , login,logout} = require('../Controller/Auth');
const {auth} =require("../Middleware/auth");
const {addtodo,deletetodo,edittodo,getAllTodo}=require("../Controller/DataManipulation"); 
router.post('/signup',signUp);
router.post('/login',login);
router.get('/logout',logout);

router.post('/addtodo',auth,addtodo);
router.post('/deletetodo',auth,deletetodo);
router.post('/edittodo',auth,edittodo);
router.get('/getAllTodo',auth,getAllTodo);

module.exports=router