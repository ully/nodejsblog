var editor =null;
jQuery(function($){
 editor = KindEditor.create('textarea[name="content_1"]');
})

function ajaxSubmitUserInfo() {
	var nickname = jQuery("#nickname").val();
	var intro = jQuery("#intro").val();
	var contact = jQuery("#contact").val();
	if(nickname && intro && contact) {
		$.ajax({
			  url: "/admin/userinfo/edit",
			  type:"POST",
			  data:decodeURIComponent("name="+nickname+"&intro="+intro+"&contact="+contact),
			  cache: false,
			  dataType:"json",
			  success: function(json){
				  if(json.status) {
					  alert("保存成功");	  
				  }else{
					  alert("保存失败");
				  }
			  }
			});
	}
}


function addBlog() {
	var title = jQuery("#title").val();
	var content = editor.html();
	var type = jQuery("#type").val();
	console.log(content);
	
	
	if(title && content && type) {
		$("#content").val(content);
		$("#blog_add_form").submit();
	}
}