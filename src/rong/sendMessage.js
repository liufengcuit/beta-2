import vuexDatas from '../store/index'
import hande_state from './handle-state.js'
export default {
	sendTextMsg:(data)=>{
		var msg;
		console.log(data);
		var curr_chat_type = vuexDatas.state.curr_chat_type;
		var targetId;
		var curr_chat;

		if(curr_chat_type == 1){
			curr_chat = vuexDatas.state.active_friend
			targetId = curr_chat.id.toString();  //目标ID
		}else if(curr_chat_type == 3){
			curr_chat = vuexDatas.state.active_group
			targetId = curr_chat.group_id.toString();  //目标ID
		}
		msg = new RongIMLib.TextMessage({
					content:RongIMLib.RongIMEmoji.symbolToEmoji(data),extra:"附加信息",
					user:{
						id:vuexDatas.state.login_user.id,
						name:vuexDatas.state.login_user.username,
						portrait:vuexDatas.state.login_user.avatar
					}
				});
		//发送消息
		console.log(curr_chat_type, targetId, msg)
		sendSuccessMessage(curr_chat_type, targetId, msg);
	},
	sendImageMsg(){
		//获取图片
		// var files = document.querySelector('input[type=file]').files[0];
		// 	if(document.querySelector('input[type=file]').value == ""){
		// 	alert("请上传图片");
		// 	return false;
		// }else{
		// 	if(!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(document.querySelector('input[type=file]').value)){
		// 	  alert("图片类型必须是.gif,jpeg,jpg,png中的一种")
		// 	  return false;
		// 	}
		// }
		// var base_img = new FileReader();
		// base_img.readAsDataURL(files);
		// base_img.onload=function(e){
		// 	var fl = new FormData();
		// 	fl.append('file',files);
		// 	fl.append('signString',signString);
		// 	fl.append('module','group');
		// 	var xhr = new XMLHttpRequest();
		// 	xhr.open('POST','http://social.haboai120.com/v1/upload/image',true);
		// 	xhr.send(fl);
		// 	xhr.onreadystatechange=function(){
		// 		if(xhr.status==200 && xhr.readyState==4){
		// 			//data:image/png;base64,
		// 			console.log(xhr.responseText)
		// 			var arr = files.name.split('.');
		// 			var imgBaseUri = e.target.result.split(",")[1];
		// 			var msg;

		// 			//
		// 			var curr_chat_type = store.state.curr_chat_type;
		// 			var targetId;
		// 			var curr_chat;

		// 			if(curr_chat_type == 1){
		// 				curr_chat = store.state.curr_chat_friends
		// 				targetId = curr_chat.id.toString();  //目标ID
		// 			}else if(curr_chat_type == 3){
		// 				curr_chat = store.state.curr_chat_group
		// 				targetId = curr_chat.group_id.toString();  //目标ID
		// 			}
		// 			//发送消息
		// 			if(arr[(arr.length-1)].toLowerCase() == 'gif'){
		// 				msg = new RongIMClient.RegisterMessage.GifMessage({
		// 					messageName:"GifMessage",
		// 					url:JSON.parse(xhr.responseText).data.url,
		// 					id:store.state.curr_login_user.id,
		// 					name:store.state.curr_login_user.username,
		// 					portraitUri:store.state.curr_login_user.avatar,
		// 					message:{
		// 						content:{
		// 							id:store.state.curr_login_user.id,
		// 							name:store.state.curr_login_user.username,
		// 							portraitUri:store.state.curr_login_user.avatar,
		// 							url:JSON.parse(xhr.responseText).data.url
		// 						}
		// 					}
		// 				});
		// 			}else{
		// 				msg = new RongIMLib.ImageMessage({
		// 					content:imgBaseUri,
		// 					imageUri:JSON.parse(xhr.responseText).data.url,
		// 					messageName:'ImageMessage',
		// 					user:{
		// 						id:store.state.curr_login_user.id,
		// 						name:store.state.curr_login_user.username,
		// 						portrait:store.state.curr_login_user.avatar
		// 					}
		// 				});
		// 			}
		// 			sendSuccessMessage(curr_chat_type, targetId, msg);
		// 		}
		// 	}.bind(this)
		// }.bind(this)
	}
}

function sendSuccessMessage(conversationtype, targetId, msg){
	RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
	    onSuccess: function (message) {
	    	console.log("Send successfully");
	    	console.log(message)
	    	if(message.messageType=="TextMessage"){
	      		message.content.content = RongIMLib.RongIMEmoji.emojiToHTML(message.content.content)
	      		hande_state.checkGroupMsg(message);
	      	}else{
	      		hande_state.checkGroupMsg(message);
	      	}
	      	// scroll.setScrollBottom(".msg_list");
	       
	    },
	    onError: function (errorCode,message) {
	        var info = '';
	        switch (errorCode) {
	            case RongIMLib.ErrorCode.TIMEOUT:
	                info = '超时';
	                break;
	            case RongIMLib.ErrorCode.UNKNOWN_ERROR:
	                info = '未知错误';
	                break;
	            case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
	                info = '在黑名单中，无法向对方发送消息';
	                break;
	            case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
	                info = '不在讨论组中';
	                break;
	            case RongIMLib.ErrorCode.NOT_IN_GROUP:
	                info = '不在群组中';
	                break;
	            case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
	                info = '不在聊天室中';
	                break;
	            default :
	                info = '发生了其它错误';
	                break;
	        }
	        alert(info);
	        console.log('发送失败:' + info);
	    }
	});
}