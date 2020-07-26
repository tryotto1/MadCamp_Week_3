var mongoose = require('mongoose');
 
const Schema = mongoose.Schema;
 
const user_friend = new Schema({
  my_email :  {type:String, default:"no email"},
  friend_email :  {type:String, default:"no friend email"}
})
 
module.exports = mongoose.model('friend',user_friend);

