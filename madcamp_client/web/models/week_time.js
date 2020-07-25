var mongoose = require('mongoose');
 
const Schema = mongoose.Schema;
 
const user_time = new Schema({
  my_email :  {type:String, default:"no email"},
  my_today_time :  {type:Number, default:0},
  my_week_time :  {type:Number, default:0}  
})
 
// 테이블 설정하는거 (Address_book: 스키마, 'address_book': 테이블 이름)
module.exports = mongoose.model('week_time',user_time);

