// index.html을 가져오기 위함
var fs = require('fs');
var path = require('path');

// 라우터를 연결해주기 위함
var express = require('express');
const router = express.Router();

// 홈페이지를 열어준다
router.get('/', function(req, res){
    fs.readFile(path.join(__dirname, './set_html/login_signin.html'), function(error, data){
        if(error){
            console.log(error);
        }else{
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        }
    });
})

/* DB에 접근해야 하는 호출들 */
var UserInfo = require('../models/users');
var mongoose = require('mongoose');

// 로그인 기능
router.post('/login', (req, res)=>{
    if (req.body.my_email === "") {
        return res.status(400).json({
          error: "EMPTY USERNAME",
          code: 2
        });
      }
     
    if (req.body.my_pwd === "") {
      return res.status(400).json({
        error: "EMPTY CONTENTS",
        code: 2
      });   
    }

    UserInfo.findOne({"my_email": req.body.my_email, "my_pwd": req.body.my_pwd}, function(err, userInfo){
        if(err){
             return res.status(500).json({error: 'Internal Error'});
        }
        if(userInfo == null){
            return res.status(404).json({error:'Wrong Email and Password'});
        }
        return res.status(200).json(req.body.my_email);
     });
});

// 회원가입 기능
router.post('/signin', (req, res)=>{
  /* 비어있으면 안 된다 */
  if (req.body.my_email === "") {
    return res.status(400).json({
      error: "EMPTY EMAIL",
      code: 2
    });
  }
 
  if (req.body.my_pwd === "") {
    return res.status(400).json({
      error: "EMPTY PWD",
      code: 2
    });
  }

  if (req.body.my_goal === "") {
    return res.status(400).json({
      error: "EMPTY GOAL",
      code: 2
    });
  }

  console.log(req.body);
 
  // 중복 가입을 막아줘야 한다
  UserInfo.findOne({"my_email": req.body.my_email}, function(err, userInfo){
      if(err){   
        return res.status(500).json({error: 'Internal Error'});        
      }
      // 겹치는 이메일이 없다
      if(userInfo==null){ 
        // 저장해준다
        let tmp_userInfo = new UserInfo({
          my_email: req.body.my_email,
          my_pwd: req.body.my_pwd,
          my_goal: req.body.my_goal    
        });
        
        // 저장해준다
        tmp_userInfo.save(err => {
          if (err) throw err;
          return res.json(req.body.my_email);
        });
      }
      // 겹치는 이메일이 있다.
      else{
        console.log("현재 이메일을 저장하지 않는다");
        return res.json({success : "Successfull"});
      }
   });
});
module.exports = router;