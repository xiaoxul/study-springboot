$(document).ready(function(){
	var context = $('#context').text();
	$('#context').html(replaceStr(context));
})

function replaceStr(str){
	var reg=new RegExp("\n","g");
	str = str.replace(reg,"<br>");
	return str;
}

