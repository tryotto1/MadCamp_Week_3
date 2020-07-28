// 통합 처리를 위한 임포트
var express = require('express');
var app = express();

// html을 처리하기 위한 임포트
var fs = require('fs');

// 디비 구축을 위한 임포트
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// 몽고DB 연결하기
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    console.log('connected mongodb server!');
});
mongoose.connect('mongodb://localhost/test');   // test 맞나?

// ejs와 bootstrap을 연결하기 위함 - 코드 순서가 중요! 반드시 use의 맨 앞부분에 이런 설정을 해주자
app.use(express.static(__dirname + '/public'));

// cookie parser를 사용하기 위함
var cookieParser = require('cookie-parser');
app.use(cookieParser())

// 들어오는 신호를 잘 처리해주기 위한 설정
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/api', require('./routes/index'));

// ejs를 사용하기 위한 기본 설정
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// 서버 연결하기
const port = 80;
app.listen(port, function(){
    console.log("Server Listening on port number 80");
})

// 기본 화면 설정 (=index 화면, ejs)
app.get('/', function(request, response){
    if(request.cookies.user == null){   // 로그인이 안 되어 있는 경우
        response.render('index', {
            login_flag : "no"
        });   
    }else{
        response.render('index', {
            login_flag : "yes"
        });   
    }    
})