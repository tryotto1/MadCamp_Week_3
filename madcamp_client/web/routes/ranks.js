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

    // 저장해준다
    let friendInfo = new FriendInfo({
        my_email: req.body.my_email,
        my_pwd: req.body.my_pwd,
        my_goal: req.body.my_name    
    });

    // 중복된 친구를 등록하지 않기 위함
    FriendInfo.findOne({"my_email": req.body.my_email, "friend_email": req.body.friend_email}, function(err, userInfo){
        if(err){
          return res.status(500).json({error: 'internal error'});
        }
        
        else if(friendInfo == null){
          friendInfo.save(err => {
            if (err) throw err;
            return res.json({ success: true });
          });
          return res.status(500).json({success: 'Successful'});          
        }else{
          return res.status(404).json({error:'already existing friend'});
        }
     });
});

module.exports = router;