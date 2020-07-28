// index.html을 가져오기 위함
var fs = require('fs');
var path = require('path');
var crypto = require('crypto')

// 라우터를 연결해주기 위함
var express = require('express');
const router = express.Router();

// cookie parser를 사용하기 위함
var cookieParser = require('cookie-parser')
router.use(cookieParser())

// 로그인 홈페이지를 열어준다 - ejs 버전
router.get('/page_login', function(req, res, next){
  // 로그인 되어있을 경우, 다시 메인 화면으로 돌아간다
  if(req.cookies.user!=null){
    res.redirect('../../')
  }  

  res.render('page_login', { 
    login_flag : "no"
  });
})

// 회원가입 홈페이지를 열어준다 - ejs 버전
router.get('/page_signin', function(req, res, next){
  // 로그인 되어있을 경우, 다시 메인 화면으로 돌아간다
  if(req.cookies.user!=null){
    res.redirect('../../')
  }
    
  res.render('page_signin', { 
    login_flag : "no"
  });
})

// 로그 아웃 기능
router.get('/logout', (req, res)=>{
  res.clearCookie("user")
  res.redirect('../../../')
})

/* DB에 접근해야 하는 호출들 */
var UserInfo = require('../models/users');
var mongoose = require('mongoose');
const { render } = require('ejs');

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

    // 로그인 될때 들어온 비밀번호를 해싱해준다
    let hash_pwd = crypto.createHash("sha512").update(req.body.my_pwd).digest('base64')
    hash_pwd = crypto.createHash("sha512").update(hash_pwd).digest('hex')
    console.log("해싱된 비밀번호 (로그인) :" + hash_pwd)

    // DB 에서 해당 회원 정보를 찾아본다
    console.log("email: " + req.body.my_email + " pwd : " + hash_pwd + "  total : " + req.body);
    UserInfo.findOne({"my_email": req.body.my_email, "my_pwd": hash_pwd}, function(err, userInfo){
        if(err){
          return res.status(500).json({error: 'Internal Error'});
        }
        if(userInfo == null){
          console.log(userInfo + " 1");
          return res.status(404).json({error:'Wrong Email and Password'});
        }else{
          console.log(userInfo + " 2");
          res.cookie("user", req.body.my_email, {
            expire : new Date(Date.now()+9000000)
          })
          return res.redirect("../../../")        
        }        
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

  // console.log(req.body);
 
  // 중복 가입을 막아줘야 한다
  UserInfo.findOne({"my_email": req.body.my_email}, function(err, userInfo){
      if(err){   
        return res.status(500).json({error: 'Internal Error'});        
      }
      // 겹치는 이메일이 없다
      if(userInfo==null){ 

        // 비밀번호를 해싱 해준다
        let hash_pwd = crypto.createHash("sha512").update(req.body.my_pwd).digest('base64')
        hash_pwd = crypto.createHash("sha512").update(hash_pwd).digest('hex')
        console.log("비밀번호 해싱됨 (회원가입) : " + hash_pwd);

        // 저장해준다
        let tmp_userInfo = new UserInfo({
          my_email: req.body.my_email,
          my_pwd: hash_pwd,
          my_goal: req.body.my_goal    
        });
        
        // 쿠키 값을 저장해준다
        res.cookie("user", req.body.my_email, {
          expire : new Date(Date.now()+9000000)
        })

        // 저장해준다
        tmp_userInfo.save(err => {
          if (err) throw err;
          return res.redirect('../../');
        });
      }
      // 겹치는 이메일이 있다.
      else{
        console.log("현재 이메일을 저장하지 않는다");
        return res.redirect('../../');
      }
   });
});
module.exports = router;