// index.html을 가져오기 위함
var http = require('http');
var fs = require('fs');
var path = require('path');

// 라우터를 연결해주기 위함
var express = require('express');
var cookie = require('cookie');
const router = express.Router();

// 홈페이지를 열어준다 - ejs 버전
router.get('/', function(req, res, next){  
  console.log("쿠키 되나요?" + req.cookies.user)
  res.render('rank_user', { 
		title: 'Express',
    length : 5,
    value : 5
  });
})

/* DB에 접근해야 하는 호출들 */
var FriendInfo = require('../models/friend');
var WeekTime = require('../models/week_time');
var mongoose = require('mongoose');
const { resolve } = require('path');
const { request } = require('http');

// 친구 추가 기능
router.post('/add_friend', (req, res)=>{
    if (req.body.my_email === "") {
        return res.status(400).json({
          error: "EMPTY EMAIL",
          code: 2
        });
      }
     
    if (req.body.friend_email === "") {
      return res.status(400).json({
        error: "EMPTY FRIEND EMAIL",
        code: 2
      });     
    }

    // FriendInfo.findOne({"my_email": req.body.my_email, "friend_email": req.body.friend_email}, function(err, friendInfo){
      FriendInfo.findOne({"my_email": req.cookies.user, "friend_email": req.body.friend_email}, function(err, friendInfo){
      if(err)
           return res.status(500).json({error: 'Internal Error'});
      
      // 존재하지 않는 이메일/PW임 - 중복 안됨
      if(friendInfo == null){ 
          console.log("여기다 - 저장할게");

          // 새 document를 저장해주기 위해 임시 document 객체를 받는다
          var tmp_friendInfo = new FriendInfo({
            my_email: req.body.my_email,
            friend_email: req.body.friend_email        
          });

          // 저장해준다
          tmp_friendInfo.save(err => {
            if (err) throw err;
            return res.render('rank_user');            
          });          
      }
      // 존재하는 이메일/PW임 - 중복됨
      else{
        console.log("여기다2 - 저장 안할게");
        return res.render('rank_user');            
        // return null;
      }
   });

    console.log("되는거니?");
});

// 모든 친구들 기록 가져오기 기능 + 모든 사용자 가져오기 기능
router.get('/fetch_friends', (req, res)=>{  
  // 순서대로 진행되어야 - async & await 기법 사용
  var tmpFriendArray =[]
  var tmpTimeArray =[]
  async function final_rank(){
    await get_friend_phone();
    await get_friend_time();    
    await give_friend();
  } 

  // await 함수 - 1
  function get_friend_phone(){
    console.log('step1');
    return new Promise(function(resolve, reject){
      setTimeout(function(){
        FriendInfo.find({"my_email":req.cookies.user}, function(err,friendInfo){
          // FriendInfo.find({"my_email":tmp_my_email}, function(err,friendInfo){
          if(err){
            return res.json({ failure : failed })    
          }
          else{
            for(var i=0;i<friendInfo.length;i++){
              console.log("내 이메일 : " + req.cookies.user + "친구 이메일 : " + friendInfo[i].friend_email);
              tmpFriendArray.push(friendInfo[i].friend_email);            
            }  
            resolve();
          }    
        })         
      });
    });
  } 
  
  // await 함수 - 2
  function get_friend_time(){    
    console.log('step2');
    return new Promise(function(resolve, reject){
      console.log("tmpFriendArray 크기 : " + tmpFriendArray.length); 
      var cnt=0;     
      setTimeout(function(){        
        for(var i=0;i<tmpFriendArray.length;i++){  
          console.log("친구 이메일 주소 : " + tmpFriendArray[i])
          WeekTime.findOne({"my_email":tmpFriendArray[i]},{_id:0, __v:0}, function(err,weekTime){            
            if(err){
              cnt = cnt + 1;
              return res.json({ failure : failed })             
            }
            else if(weekTime==null){
              cnt = cnt + 1;
            }
            else{
              cnt = cnt + 1;              
              tmpTimeArray.push(weekTime);
              
              if(cnt == tmpFriendArray.length){
                resolve();
              }              
            }          
          })
        }
      });
    });
  }

  // await 함수 - 3
  function give_friend(){    
    console.log('step3');
    return new Promise(function(resolve, reject){      
      console.log("tmpTimeArray 크기 : " + tmpTimeArray.length);      
      tmpTimeArray.sort((a,b) => a.my_week_time - b.my_week_time);
      tmpTimeArray.reverse();
      setTimeout(function(){        
        WeekTime.find({}, function(err, weekTime){
          if(err){
            return res.status(500).json({error:"Internal Error"});
          }else{
            return res.render('rank_user_friend', {
              all_rank : weekTime,
              friend_rank : tmpTimeArray
            })
          }
        }).sort({"my_week_time":-1})

        // return res.render('rank_user_friend', {
        //   dummy : 3,
        //   friend_rank : tmpTimeArray
        // })
      }) 
    })
  }

  final_rank();
});

module.exports = router;