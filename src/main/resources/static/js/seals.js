$(document).ready(function(){
//-----------------------------------初期化にする---------------------------------------------------------
	//初期化にするreceptionSkip());
	validator2AreaShow($("#validator2Id").val())
    receptionAreaShow($("#receptionId").val());	 
	assistantAreaShow($("#assistantId").val());	 
	readerAreaShow($("#readerId").val());
	delegateTextAreaShow($("#holderId").val());
//----------------------------------情報Areaの表示----------------------------------------------------------
	
	//公印アップデート画面の第二検証者の初期化の情報Areaを表示させる
 	function validator2AreaShow(validator2Id){
 		if(validator2Id == "" || validator2Id == null){
 			return;
 		}
    	$.each(jQuery.parseJSON(validator2Id),function(idx,obj){
    			getBluePageInfoButtonClick("getValidator2InfoButton",obj);		
    	})
 	}
 	
 	//公印アップデート画面の受付窓口の初期化の情報Areaを表示させる
    function receptionAreaShow(receptionId){
    	if(receptionId == "" || receptionId == null){
 			return;
 		}
    	$.each(jQuery.parseJSON(receptionId),function(idx,obj){
    			getBluePageInfoButtonClick("getReceptionInfoButton",obj);
    	})
  	}
	
	 //公印保持者IDをChangeする時、自動に公印保持者代行テキストに表示される
	 $("#holderId").change(function(){
		 delegateTextAreaShow($("#holderId").val());
	 });
	
	 //公印アップデート画面の公印保持者アシスタントの初期化の情報Areaを表示させる
	 function assistantAreaShow(assistantId){
	    	if(assistantId == "" || assistantId == null){
	 			return;
	 		}
	    	$.each(jQuery.parseJSON(assistantId),function(idx,obj){		
	    		getBluePageInfoButtonClick("getAssistantInfoButton",obj);
	    	})
	  }
  	
  	//公印アップデート画面の公印捺印・署名申請 読者の初期化の情報Areaを表示させる
  	function readerAreaShow(readerId){
  		
  		if(readerId == "" || readerId == null){
 			return;
 		}
    	$.each(jQuery.parseJSON(readerId),function(idx,obj){		
    			getBluePageInfoButtonClick("getReaderInfoButton",obj);
    	})
  	}
    
  //----------------------------------ボタンのクリックの表示----------------------------------------------------------
  	
    //第二検証者の情報を取得する場合ボタンを押す
	$("#getValidator2InfoButton").click(function(){
			//var jsonValidator2IdStr = '["'+$("#validator2Id_text").val()+'"]';
			
	    	//ErrorMsgを初期化にする
	    	$("#validator2IdErr").hide();
	    	var len = $("#validator2Area span").length;
	    	if(len<5)
	    	{
	    		getBluePageInfoButtonClick("getValidator2InfoButton",$("#validator2Id_text").val());	
	    	}
	    	//第二検証者は５名以上の場合、ErrMsgが出る
	    	else{
	    		$("#validator2IdErr").text("第二検証者は最大５名になっています。");
	    		$("#validator2IdErr").show();
	    	}
	});
  	
	
	//受付窓口の情報を取得する場合ボタンを押す
    $("#getReceptionInfoButton").click(function(){
    	
    	//ErrorMsgを初期化にする
    	$("#receptionIdErr").hide();
    	var len = $("#receptionArea span").length;
    	if(len<5)
    	{		
    		getBluePageInfoButtonClick("getReceptionInfoButton",$("#receptionId_text").val());
    	}
    	//受付窓口は５名以上の場合、ErrMsgが出る
    	else{
    		$("#receptionIdErr").text("受付窓口は最大５名になっています。");
    		$("#receptionIdErr").show();
    	}
    });

    //公印保持者アシスタントの情報を取得するボタンを押す
    $("#getAssistantInfoButton").click(function(){
    	
    	//ErrorMsgを初期化にする
    	$("#assistantIdErr").hide();
    	var len = $("#assistantArea span").length;
    	if(len<5)
    	{
    		getBluePageInfoButtonClick("getAssistantInfoButton",$("#assistantId_text").val());
    	}
    	//公印保持者アシスタントは1名以上の場合、ErrMsgが出る
    	else{
	    		$("#assistantIdErr").text("公印保持者アシスタントは最大5名になっています。");
	    		$("#assistantIdErr").show();
    		}
    });
  	
	
    //公印捺印・署名申請 読者の情報を取得するボタンを押す
  	$("#getReaderInfoButton").click(function(){
  		
    	//ErrorMsgを初期化にする
    	$("#readerIdErr").hide();
    	var len = $("#readerArea span").length;
    	if(len<5)
    	{
    		getBluePageInfoButtonClick("getReaderInfoButton",$("#readerId_text").val());    		
    	}
    	//公印捺印・署名申請 読者の情報は5名以上の場合、ErrMsgが出る
    	else{
    		$("#readerIdErr").text("公印捺印・署名申請 読者は最大5名になっています。");
    		$("#readerIdErr").show();
    	}
  	});
  	
  	
	//種類とMailIdにより、Bluepage情報を取得して、種類により情報を画面に添付する
	function getBluePageInfoButtonClick(catelogy,mailId){
		
		if(catelogy=="" || catelogy==null || mailId=="" || mailId==null){
			return;
		}
		
		  $.ajax({
		        type: "POST",  
	            url: encodeURI("../getBluePageInfo"),  
	            data:{"mailId":mailId},
	            contentType: "application/x-www-form-urlencoded; charset=utf-8", 
	            async:true,
	//          data: obj,  
	//          dataType: "json",  
	           success: function(obj){
	        	   
	        	   //var objArr = jQuery.parseJSON(data);
	        	  // $.each(objArr, function(idx, obj) {
	        		  
	        		  if (obj.mail == "")
	        		  {
	 	        		    //第二検証者の情報を取得する場合
	 			    		if(catelogy == "getValidator2InfoButton"){
	 			    		   $("#validator2IdErr").text("Bluepage情報は見つかりません。正しいIntranetIdを入力してください。");
	 			        	   $("#validator2IdErr").show();           
	 			    		}
	 			    		//捺印受付窓口の情報を取得する場合
	 			     		if(catelogy == "getReceptionInfoButton"){
	 			     			 $("#receptionIdErr").text("Bluepage情報は見つかりません。正しいIntranetIdを入力してください。");
	 			 				 $("#receptionIdErr").show();
	 			 			}
	 			     		//公印保持者アシスタントの情報を取得する場合
	 			     		if(catelogy == "getAssistantInfoButton"){
	 			     			 $("#assistantIdErr").text("Bluepage情報は見つかりません。正しいIntranetIdを入力してください。");
	 			 				 $("#assistantIdErr").show();
	 			 			}
	 			     		//公印捺印・署名申請 読者の情報を取得する場合
	 			     		if(catelogy == "getReaderInfoButton"){
	 			     			 $("#readerIdErr").text("Bluepage情報は見つかりません。正しいIntranetIdを入力してください。");
	 			 				 $("#readerIdErr").show();
	 			 			}
	        		   }
	        		  
	        		  else
					  {
		        		 var appendHtml =
		        			 "<span>"+
		        			   "<table>"+
		        			 	  "<tr><td>Intranet Id:</td><td>"+obj.mail+"</td></tr>" +
			        			  "<tr><td>氏名:</td><td>"+ obj.callUpName +"</td></tr>" +
			        			  "<tr><td>所属組織コード:</td><td>"+ obj.dept +"</td></tr>" +
			        			  "<tr><td>所属組織名:</td><td>"+ obj.deptTitle +"</td></tr>" +
			 				      "<input type=\"hidden\" value=\""+obj.mail+"\"/>" +		        			
			 				   "</table>" +
			 				   "<button type=\"button\" class=\"ds-button ds-small ds-width-auto\">削除</button>" +		
			 				 "</span>";
		        		
			 				 
			     		//第二検証者の情報を取得する場合
			    		if(catelogy == "getValidator2InfoButton"){
			    			 //取得する第二検証者Idがすでに存在しているかをチェックする
			    			 var isRepeat = checkIsRepeat("validator2Area",obj.mail);
			    			 if(isRepeat)
			    			 {
			    				 $("#validator2IdErr").text("取得した社員IDはすでに存在しています。ご確認ください。");
			    		         $("#validator2IdErr").show();
			    			 }
			    			 else
			    			 {
			    				 $("#validator2Area").append(appendHtml);
			    				 $("#validator2Id_text").val("");
			    			 }
			    		}
			            //捺印受付窓口	の情報を取得する場合
			     		if(catelogy == "getReceptionInfoButton"){
			     			 
			     			//取得する捺印受付窓口Idがすでに存在しているかをチェックする
			    			var isRepeat = checkIsRepeat("receptionArea",obj.mail);
			    			if(isRepeat)
			    			{
			    	 			$("#receptionIdErr").text("取得した受付窓口はすでに存在しています。ご確認ください。");
			 			        $("#receptionIdErr").show();
			    			}
			    			else
			    		    {
			    				$("#receptionArea").append(appendHtml);
			    				$("#receptionId_text").val("");
			    		    }
			 			}
			     		//公印保持者アシスタントの情報を取得する場合
			     		if(catelogy == "getAssistantInfoButton"){
			     			
			     			//取得する公印保持者アシスタントIdがすでに存在しているかをチェックする
			    			var isRepeat = checkIsRepeat("assistantArea",obj.mail);
			    			if(isRepeat)
			    			{
			    	 			$("#assistantIdErr").text("取得した公印保持者アシスタントはすでに存在しています。ご確認ください。");
			 			        $("#assistantIdErr").show();
			    			}
			    			else
			    		    {
			    				$("#assistantArea").append(appendHtml);
			    				$("#assistantId_text").val("");
			    		    }
			 			}
			     		//公印捺印・署名申請 読者の情報を取得する場合
			     		if(catelogy == "getReaderInfoButton"){
			     			
			     			//取得する公印捺印・署名申請がすでに存在しているかをチェックする
			    			var isRepeat = checkIsRepeat("readerArea",obj.mail);
			    			if(isRepeat)
			    			{
			    	 			$("#readerIdErr").text("取得した公印捺印・署名はすでに存在しています。ご確認ください。");
			 			        $("#readerIdErr").show();
			    			}
			    			else
			    		    {
			    				$("#readerArea").append(appendHtml);
			    				$("#readerId_text").val("");
			    		    }
			 			}
					  }
	        	 //  });
				}
 			});	        	
	 };
	
	 ///自動に公印保持者代行テキストに表示される
	 function delegateTextAreaShow(mailId){
//	 		if(mailId == "" || mailId ==null){
//	 			return;
//	 		}
		 if (mailId == null || mailId == "null" || mailId == "") {
				return false;
			}
		 $.ajax({
				type : "POST",
				url : encodeURI("getdelegateinfo"),
				data : {
					"mailId":mailId
				},
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				async : true,
	            success: function(data){
	     	 //公印保持者代行テキストアリアをクリアする
	  		 $("#delegateArea span").remove();
	  		var delegateObj = jQuery.parseJSON(data);
	     	  if(delegateObj.length >0)
	     	  {
		     	  $.each(delegateObj, function(i,val){      
		     	     var appendHtml = 
		     	    	 "<span>"+
				              "代行番号:"+val.requestNo+" <br/>" +
				              "代行者ID:"+val.delegateID+" <br/>" +
				              "代行者氏名:"+val.delegateName+" <br/>" +
				              "代行の委任期間:"+val.delegateStartDate+"から"+val.delegateEndDate+"まで <br/>" +
			 				  "<br/></span>";
			 	     	   		$("#delegateArea").append(appendHtml);
		     	  });   
 	     	  }
 	     	  else{
 	     		 var appendHtml = 
 	 	     		   "<span>公印保持者「"+mailId+"」の代行情報がありません。 </span>";
 	 	     		   $("#delegateArea").append(appendHtml);	
 	     	  }
	     	 } 
	      });
	 }
	 
//--------------------------取得するIdがすでに存在しているかをチェックする------------------------------------------------------------------

	function checkIsRepeat(areaName,value){
		var isRepeat = false;
		$("#"+areaName+" span").each(function(i){
 			  var hidVal=$(this).find("input[type='hidden']").val();	
 			  if(value == hidVal)
 			  {
 				 isRepeat = true;
 			  }
 		 });
		 return isRepeat;
	}
	
//-------------------削除ボタンの押し--------------------------------------------------------------	 	 
	 
	 
	  //第二検証者の削除ボタンを押す
 	$("#validator2Area").on("click","button",function(){
	        $(this).parent().remove();
	      	//第二検証者は５名以内の場合、ErrMsgが消える
	        var len = $("#validator2Area span").length;
	        if(len<5)
	    	{
	        	$("#validator2IdErr").hide();
	    	}
	});  
 	//受付窓口の情報の削除ボタンを押す
 	$("#receptionArea").on("click","button",function(){  
	        $(this).parent().remove();
	      	//受付窓口は５名以内の場合、ErrMsgが消える
	        var len = $("#receptionArea span").length;
	        if(len<5)
	    	{
	        	$("#receptionIdErr").hide();
	    	}
	});
 	//公印保持者アシスタントの情報を削除するボタンを押す
 	$("#assistantArea").on("click","button",function(){  
	        $(this).parent().remove();
	      	//公印保持者アシスタントは５名以内の場合、ErrMsgが消える
	        var len = $("#assistantArea span").length;
	        if(len<5)
	    	{
	        	$("#assistantIdErr").hide();
	    	}
	});
 	
 	//公印捺印・署名申請 読者の情報の削除ボタンを押す
 	$("#readerArea").on("click","button",function(){  
	        $(this).parent().remove();
	      	//公印捺印・署名申請 読者は1名以内の場合、ErrMsgが消える
	        var len = $("#readerArea span").length;
	        if(len<1)
	    	{
	        	$("#readerIdErr").hide();
	    	}
	}); 
 	
//--------------------------受付窓口スキップの判断-------------------------------------------------
 	
 	//公印新規画面で保存ボタンを押す
 	$("#saveButton").click(function(){
 		//var overlayElement = document.querySelector('#saveButton-overlay')
 		//var myOverlay = w3ds.overlay(overlayElement)
 		
 		//var len = $("#receptionArea span").length;
        //受付窓口がない場合
//        if(len<1)
//    	{
//        	//「受付スキップ」確認MSG
//        	$("#saveSkipMsgDiv").show();
//        	$("#saveMsgDiv").hide();
//    	}
//        //受付窓口がいる場合、FormをSubmitする
//        else{
        	//$("#saveSkipMsgDiv").hide();
        	//$("#saveMsgDiv").show();
//        }
        //myOverlay.open(overlayElement);
 		submitFun();
 	})
 	
 	//公印更新画面で保存ボタンを押す
 	$("#updateButton").click(function(){
// 		var overlayElement = document.querySelector('#updateButton-overlay')
// 		var myOverlay = w3ds.overlay(overlayElement)
// 		
// 		//公印はスキップではない状態の場合、
// 		if($("#receptionSkip").val()=='N'){
//	 		var len = $("#receptionArea span").length;
//	        //受付窓口がない場合
//	        if(len<1 )
//	    	{
//	        	//「受付スキップ」確認MSG
//	        	$("#updateSkipMsgDiv").show();
//	        	$("#updateMsgDiv").hide();
//	    	}
//	        //受付窓口がいる場合、FormをSubmitする
//	        else{
//	        	$("#updateSkipMsgDiv").hide();
//	        	$("#updateMsgDiv").show();
//	        }
// 		}
// 		//公印はすでにスキップの状態の場合、
// 		else{
// 			$("#updateSkipMsgDiv").hide();
//        	$("#updateMsgDiv").show();
// 		}
//        myOverlay.open(overlayElement);
        
        submitFun();
 	})
 	
 	$("#receptionSkipSaveButton").click(function(){
 		submitFun();
 	})
//---------------------------Submitの処理------------------------------------------------------	 
 	function submitFun(){
	 	
		//Sumbitの前に第二検証者IdのHiddenの値を与える
		//第二検証者IdのHiddenの値として、第二検証者のJsonArrayを定義する
		var validator2IdJsonArrStr = [];
		//Sumbitの前に捺印受付窓口IdのHiddenの値を与える
		//捺印受付窓口IdのHiddenの値として、捺印受付窓口のJsonArrayを定義する
		var receptionIdJsonArrStr = [];
		//Sumbitの前に公印保持者アシスタントIdのHiddenの値を与える
		//公印保持者アシスタントIdのHiddenの値として、公印保持者アシスタントのJsonArrayを定義する
		var assistantIdJsonArrStr = [];
		//Sumbitの前に公印捺印・署名申請 読者IdのHiddenの値を与える
		//公印捺印・署名申請 読者IdのHiddenの値として公印捺印・署名申請 読者のJsonArrayを定義する
		var readerIdJsonArrStr = [];
		
		if($("#validator2Area span").length>0)
	 	{
		 	$("#validator2Area span").each(function(i){
		 			  var hid=$(this).find("input[type='hidden']");
		  			 //第二検証者Id Hiddenの値を与える
		          	 validator2IdJsonArrStr.push(hid.val());
		          	 $("#validator2Id").val(JSON.stringify(validator2IdJsonArrStr));
		          	
		 	});
	 	}
		else
		{
	 		$("#validator2Id").val("");
	 	}
		if($("#receptionArea span").length>0)
	 	{
		 	$("#receptionArea span").each(function(i){
					  var hid=$(this).find("input[type='hidden']");
		 			 //捺印受付窓口Id Hiddenの値を与える
		         	 receptionIdJsonArrStr.push(hid.val());
		         	 $("#receptionId").val(JSON.stringify(receptionIdJsonArrStr));
			});
	 	}
		else
	 	{
	 		$("#receptionId").val("");
	 	}
	 	if($("#assistantArea span").length>0)
	 	{
		 	$("#assistantArea span").each(function(i){
					  var hid=$(this).find("input[type='hidden']");
		 			 //公印保持者アシスタントId Hiddenの値を与える
		         	 assistantIdJsonArrStr.push(hid.val());
		         	 $("#assistantId").val(JSON.stringify(assistantIdJsonArrStr));
			});
	 	}
	 	else
	 	{
	 		$("#assistantId").val("");
	 	}
	 	if($("#readerArea span").length>0)
	 	{
		 	$("#readerArea span").each(function(i){
					  var hid=$(this).find("input[type='hidden']");
		 			 //公印捺印・署名申請 読者Id Hiddenの値を与える
		         	 readerIdJsonArrStr.push(hid.val());
		         	 $("#readerId").val(JSON.stringify(readerIdJsonArrStr));
			});
		 	
	 	}
	 	else
	 	{
	 		$("#readerId").val("");
	 	}
	 	$("#sealsVo").submit();
 	}
 });