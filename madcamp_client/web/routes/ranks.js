// index.html을 가져오기 위함
var fs = require('fs');
var path = require('path');

// 라우터를 연결해주기 위함
var express = require('express');
const router = express.Router();

// 홈페이지를 열어준다
router.get('/', function(req, res){
    fs.readFile(path.join(__dirname, './set_html/rank_user.html'), function(error, data){
        if(error){
            console.log(error);
        }else{
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        }
    });
})

/* DB에 접근해야 하는 호출들 */
var FriendInfo = require('../models/friend');
var mongoose = require('mongoose');

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


    FriendInfo.findOne({"my_email": req.body.my_email, "friend_email": req.body.friend_email}, function(err, friendInfo){
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
            return res.json({ success: true });            
          });          
      }
      // 존재하는 이메일/PW임 - 중복됨
      else{
        console.log("여기다2 - 저장 안할게");
        return res.json({ success: true });
        // return null;
      }
   });

    console.log("되는거니?");
});

// 모든 친구들 기록 가져오기 기능
router.post('/fetch_friends', (req, res)=>{
  if (req.body.my_email === "") {
      return res.status(400).json({
        error: "EMPTY EMAIL",
        code: 2
      });
    }
 
  FriendInfo.find({"my_email":req.body.my_email}, function(err,friendInfo){
    if(err){
      return res.json({ failure : failed })
    }
    return res.json(friendInfo);
  })
});

module.exports = router;