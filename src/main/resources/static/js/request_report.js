var Flag = true;
$(document).ready(function(){
//------------------------------初期化設定----------------------------------------------------
	 init();
	//SAVEボタンをクリックする
	$("#btnSearch").click(function(){
	   $("#isSearchOrDownload").val("Search");
	   submitFun();
	})

	$("#btnDownload").click(function(){
		$("#isSearchOrDownload").val("Download");
 		submitFun();
 	})


//---------------------------Submitの処理------------------------------------------------------
 	function submitFun(){

	 	$("#requestReportListVo").submit();
 	}


 });

function init(){

	var userAccessType = $('#userAccessType').val();

	if(userAccessType == "USER_FULL_ACCESS"){
		//公印名選択を初期化する
		var sealsDeptNameListJson = jQuery.parseJSON($("#sealsDeptNameListJson").val());

		$.each(sealsDeptNameListJson,function(i,obj){
			 $("#sealsDeptNameSelect").append("<option value='"+obj+"'>"+obj+"</option>")
		});
		$("#sealsTitleSelect").attr("disabled","disabled");
		$("#sealsTitleSpinner").hide();
		//入力チェックがエラーになった場合、返ってから選んだ公印情報を表示する
		var sealsId = $("#sealsId").val();
		sealsInfoShow(sealsId);
	}
	if(userAccessType == "USER_LIMITED_ACCESS"){
		//公印管理番号選択を初期化する
		var sealsManageIdListJson = jQuery.parseJSON($("#sealsManageIdListJson").val());
		$.each(sealsManageIdListJson,function(i,obj){
			 $("#sealsManageIdSelect").append("<option value='"+obj+"'>"+obj+"</option>")
		});
		$("#sealsManageIdSpinner").hide();
		//入力チェックがエラーになった場合、返ってから選んだ公印情報を表示する
		var manageId = $("#manageId").val();
		sealsInfoShowByManageId(manageId);

	}

}

function sealsInfoShow(sealsId){
	if (sealsId == null || sealsId =="")
	{
		 return;
    }
	 //Loading Spinner Show
	$("#sealsTitleSpinner").show();
	$("#sealsInfoSpan").empty();

	 $.ajax({
       type: "POST",
       url: encodeURI("seachSealsInfo"),
       data:{"sealsId":sealsId},
       contentType: "application/x-www-form-urlencoded; charset=utf-8",
       async:true,
//        data: obj,
//        dataType: "json",
       success: function(result){
    	   var data = decodeURIComponent(result);
    	   var data = data.replace(/\+/g, " ");
    	   var obj = jQuery.parseJSON(data);
    	   $('#sealsId').val(obj.sealsId);
    	  //代行者のHtmlを生成する
    	  var delegateIDStr = "";
       	  $.each(obj.delegateList,function(i,delegateObj){
       		delegateIDStr += delegateObj.delegateID;
       		if(i != obj.delegateList.length-1)
       		{
       			delegateIDStr += "，";
       		}
       	  });
       	  //第二検証者InternetIDのHtmlを生成する
       	 var vali2IdStr = "";
       	 if(obj.validator2Id == "" || obj.validator2Id == null )
       		 {
       		 vali2IdStr = "";
       		 }
       	 else
       		 {
       		 var validator2IdObj = jQuery.parseJSON(obj.validator2Id);
           	 $.each(validator2IdObj,function(i,obj){
           		vali2IdStr += obj ;
           		if(i != validator2IdObj.length-1)
           		{
           			vali2IdStr += "，";
           		}
        	 });
       		 }

       //捺印受付窓口InternetIDのHtmlを生成する
       	 var receptionIdStr = "";
       	 if(obj.receptionId == "" || obj.receptionId == null )
       		 {
       		receptionIdStr = "";
       		 }
       	 else
       		 {
       		 var receptionIdObj = jQuery.parseJSON(obj.receptionId);
           	 $.each(receptionIdObj,function(i,obj){
           		receptionIdStr += obj ;
           		if(i != receptionIdObj.length-1)
           		{
           			receptionIdStr += "，";
           		}
        	 });
       		 }

       	$("#sealsInfoSpan").empty();
//    	   var appendHtml =
//    	      "<table>"+
//    	         "<tr><td>公印名:</td><td>"+obj.title+"</td></tr>"+
//    	      	 "<tr><td>公印保持者:</td><td>"+obj.holderName+"　"+obj.holderId+"</td></tr>"+
//    	      	 "<tr><td>代行者:</td><td>"+delegateIDStr+"</td></tr>"+
//    	      	 "<tr><td>事業部/カテゴリ:</td><td>"+obj.sector+"</td></tr>"+
//    	      	 "<tr><td>公印管理番号:</td><td>"+obj.manageId+"</td></tr>"+
//    	      	 "<tr><td>第二検証者ID:</td><td>"+vali2IdStr+"</td></tr>"+
//    	      	 "<tr><td>受付窓口ID:</td><td>"+receptionIdStr+"</td></tr>"+
//    	      "</table>";

    	   var appendHtml =
     	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
     	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印名：</span></div></div>"+
     	      	"<div class='ds-col-md-9 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.title+"</span></div>"+
     	      "</div>"+
     	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
     	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印保持者 Intranet ID：</span></div></div>"+
     	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.holderId+"</span></div>"+
	  	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印保持者 氏名：</span></div></div>"+
	  	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.holderName+"</span></div>"+
	  	      "</div>"+
	  	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
	  	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>部門名：</span></div></div>"+
	  	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.deptName+"</span></div>"+
	 	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印設置事業所：</span></div></div>"+
	 	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.sealsLocation+"</span></div>"+

	 	      "</div>"+
	 	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
	 	        "<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>セクター / 分類：</span></div></div>"+
	 	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.sector+"</span></div>"+
	 	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>管理番号：</span></div></div>"+
	 	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.manageId+"</span></div>"+
	 	      "</div>";

    	   $("#manageId").val(obj.manageId);
    	   $("#sealsInfoSpan").append(appendHtml);
     	//Loading Spinner Hide
     	$("#sealsTitleSpinner").hide();
       }
	 });
}

function sealsInfoShowByManageId(manageId){
	if (manageId == null || manageId =="")
	{
		 return;
    }
	 //Loading Spinner Show
	$("#sealsManageIdSpinner").show();
	$("#sealsInfoSpan").empty();

	 $.ajax({
       type: "POST",
       url: encodeURI("seachSealsInfoByManageId"),
       data:{"manageId":manageId},
       contentType: "application/x-www-form-urlencoded; charset=utf-8",
       async:true,
//        data: obj,
//        dataType: "json",
       success: function(result){
    	   var data = decodeURIComponent(result);
    	   var data = data.replace(/\+/g, " ");
    	   var obj = jQuery.parseJSON(data);
    	   $('#sealsId').val(obj.sealsId);
    	  //代行者のHtmlを生成する
    	  var delegateIDStr = "";
       	  $.each(obj.delegateList,function(i,delegateObj){
       		delegateIDStr += delegateObj.delegateID;
       		if(i != obj.delegateList.length-1)
       		{
       			delegateIDStr += "，";
       		}
       	  });
       	  //第二検証者InternetIDのHtmlを生成する
       	 var vali2IdStr = "";
       	 if(obj.validator2Id == "" || obj.validator2Id == null )
       		 {
       		 vali2IdStr = "";
       		 }
       	 else
       		 {
       		 var validator2IdObj = jQuery.parseJSON(obj.validator2Id);
           	 $.each(validator2IdObj,function(i,obj){
           		vali2IdStr += obj ;
           		if(i != validator2IdObj.length-1)
           		{
           			vali2IdStr += "，";
           		}
        	 });
       		 }

       //捺印受付窓口InternetIDのHtmlを生成する
       	 var receptionIdStr = "";
       	 if(obj.receptionId == "" || obj.receptionId == null )
       		 {
       		receptionIdStr = "";
       		 }
       	 else
       		 {
       		 var receptionIdObj = jQuery.parseJSON(obj.receptionId);
           	 $.each(receptionIdObj,function(i,obj){
           		receptionIdStr += obj ;
           		if(i != receptionIdObj.length-1)
           		{
           			receptionIdStr += "，";
           		}
        	 });
       		 }

       	$("#sealsInfoSpan").empty();
//    	   var appendHtml =
//    	      "<table>"+
//    	         "<tr><td>公印名:</td><td>"+obj.title+"</td></tr>"+
//    	      	 "<tr><td>公印保持者:</td><td>"+obj.holderName+"　"+obj.holderId+"</td></tr>"+
//    	      	 "<tr><td>代行者:</td><td>"+delegateIDStr+"</td></tr>"+
//    	      	 "<tr><td>事業部/カテゴリ:</td><td>"+obj.sector+"</td></tr>"+
//    	      	 "<tr><td>公印管理番号:</td><td>"+obj.manageId+"</td></tr>"+
//    	      	 "<tr><td>第二検証者ID:</td><td>"+vali2IdStr+"</td></tr>"+
//    	      	 "<tr><td>受付窓口ID:</td><td>"+receptionIdStr+"</td></tr>"+
//    	      "</table>";

    	   var appendHtml =
     	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
     	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印名：</span></div></div>"+
     	      	"<div class='ds-col-md-9 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.title+"</span></div>"+
     	      "</div>"+
     	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
     	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印保持者 Intranet ID：</span></div></div>"+
     	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.holderId+"</span></div>"+
	  	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印保持者 氏名：</span></div></div>"+
	  	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.holderName+"</span></div>"+
	  	      "</div>"+
	  	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
	  	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>部門名：</span></div></div>"+
	  	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.deptName+"</span></div>"+
	 	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印設置事業所：</span></div></div>"+
	 	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.sealsLocation+"</span></div>"+

	 	      "</div>"+
	 	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
	 	        "<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>セクター / 分類：</span></div></div>"+
	 	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.sector+"</span></div>"+
	 	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>管理番号：</span></div></div>"+
	 	      	"<div class='ds-col-md-3 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.manageId+"</span></div>"+
	 	      "</div>";

    	   $("#manageId").val(obj.manageId);
    	   $("#sealsInfoSpan").append(appendHtml);
     	//Loading Spinner Hide
     	$("#sealsManageIdSpinner").hide();
       }
	 });
}

function sealsTitleChange(){
		 //sealsTitle Hiddenに値を与える
	     var sealsId = $('#sealsTitleSelect').val();
	     sealsInfoShow(sealsId);
	     $("#sealsId").val(sealsId);
//	     $("#manageId").val(sealsId);
	 };

function sealsManageIdChange(){
		 //sealsTitle Hiddenに値を与える
	     var manageId = $('#sealsManageIdSelect').val();
	     sealsInfoShowByManageId(manageId);
	     $("#manageId").val(manageId);

	 };


function sealsDetpNameChange(){
			var sealsDeptName = $('#sealsDeptNameSelect').val();
			if (sealsDeptName == "null")
			{
				$("#sealsTitleSelect").empty();
				$("#sealsTitleSelect").attr("disabled","disabled");
				$("#sealsTitleSelect").append("<option value='null'>公印名を選択ください</option>");
				return;
			}
			//Loading Spinner Show
			$("#sealsTitleSpinner").show();
					 $.ajax({
				       type: "POST",
				       url: encodeURI("seachSealsTitle"),
				       data:{"sealsDeptName":encodeURI(sealsDeptName)},
				       contentType: "application/x-www-form-urlencoded; charset=utf-8",
				       async:true,
//				        data: obj,
//				        dataType: "json",
				       success: function(result){
				    	   var data = decodeURIComponent(result);
				    	   var data = data.replace(/\+/g, " ");
				    	   $("#sealsTitleSelect").removeAttr("disabled");
				    	   $("#sealsTitleSelect").empty();
				    	   $("#sealsTitleSelect").append("<option value='null' selected>公印名を選択ください</option>");
				     	   var obj = jQuery.parseJSON(data)
				     	   var sysDate = new Date();
				     	   $.each(obj, function(i,val){
				     		  if(val.inactiveDATE == "" || val.inactiveDATE == null )
				     			  {
				     			  $("#sealsTitleSelect").append("<option value='"+val.sealsId+"'>"+val.title+"</option>");
				     			  }
				     		  else
				     			  {
				     			  var  oldDate = new Date(val.inactiveDATE);
					     		  if(oldDate > sysDate)
					     			  {
					     			  $("#sealsTitleSelect").append("<option value='"+val.sealsId+"'>"+val.title+"</option>");
					     			  }
				     			  }
				     		  });
				     	  //Loading Spinner Hide
				     	  $("#sealsTitleSpinner").hide();
				 		}
					 });
		};



;