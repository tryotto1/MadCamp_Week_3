// index.html을 가져오기 위함
var fs = require('fs');
var path = require('path');

// 라우터를 연결해주기 위함
var express = require('express');
const router = express.Router();

// 홈페이지를 열어준다
router.get('/', function(req, res){
  console.log(path.join(__dirname, './set_html/video_record.html'));

    fs.readFile(path.join(__dirname, './set_html/video_record.html'), function(error, data){    
        // fs.readFile('./index.html', function(error, data){    
        if(error){
            console.log(error);
        }else{
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        }
    });
})

/* DB에 접근해야 하는 호출들 */
var WeekTime = require('../models/week_time');
var mongoose = require('mongoose');

// 시간 누적 기능
router.post('/add_weekly', (req, res)=>{
    if (req.body.my_email === "") {
        return res.status(400).json({
          error: "EMPTY EMAIL",
          code: 2
        });
      }
     
    if (req.body.my_week_time === "") {
      return res.status(400).json({
        error: "EMPTY WEEKLY UPDATE",
        code: 2
      });   
    }

    // 저장해준다
    let weekTime = new WeekTime({
        my_email: req.body.my_email,
        my_week_time: req.body.my_week_time
    });

    // 주간 공부 시간을 업데이트 해준다
    userInfo.save(err => {
        if (err) throw err;
        return res.json({ success: true });
      });    
});

module.exports = router;