var Flag = true;
$(document).ready(function(){
//------------------------------初期化設定----------------------------------------------------
	 init();
	//SAVEボタンをクリックする
	$("#btnDraft").click(function(){
	   $("#isSaveOrSubmit").val("draft");
	   //$('#requestor').remove();
	   submitFun();
	})
	//Submitボタンをクリックする
	$("#btnSubmit").click(function(){
	   $("#isSaveOrSubmit").val("submit");
	   //$('#requestor').remove();
	   submitFun();
	})

//	$("#skipSaveButton1").click(function(){
//		$("#isSaveOrSubmit").val("submit");
// 		submitFun();
// 	})
// 	$("#skipSaveButton2").click(function(){
//		$("#isSaveOrSubmit").val("submit");
// 		submitFun();
// 	})
 	//お客様名をChangeする
	$("#customerBody").change(function(){

		setCustomerVal();
	});
	//お客様法人格をChangeする
	$('#customerStatus').click(function(){
		//alert();
		setCustomerVal();
	});
	//名前の後(左)をクリックする
	$('input:radio[id="radio11"]').click(function(){
		//alert(1);
		setCustomerVal();
	});

	//名前の後(右)をクリックする
	$('input:radio[id="radio12"]').click(function(){
		//alert(2);
		setCustomerVal();
	});

	//追加編集者+ボタンをクリックする
	$('#addAddEditorBtn').click(function(){

		var addEditorAreaDivLength = $('#addEditorArea > div').length;
		var addEditorCurrentDivId = "addEditorDiv"+ (addEditorAreaDivLength + 1);
		var addEditorCurrentInputTextName = "1addEditor"+"["+addEditorAreaDivLength+"]";

		var addEditorCurrentHtml=

		"	<div id=\""+addEditorCurrentDivId+"\" class=\"ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-1\">\r\n" +
		"    	<div class=\"ds-col-md-3\">\r\n" +
		"    		 <div class=\"ds-input-container ds-margin-bottom-2 ds-display-inline\">\r\n" +
		"    		 	<span>追加編集者Intranet ID【"+(addEditorAreaDivLength+1)+"】:</span>\r\n" +
		"             </div>\r\n" +
		"        </div>\r\n" +
		"   	    <div class=\"ds-col-md-6\">\r\n" +
		"        	 <input type=\"text\" class=\"ds-input\" value=\"\" name=\""+addEditorCurrentInputTextName+"\" placeholder=\"\">\r\n" +
		"      	</div>\r\n" +
		"    </div>";
		$('#addEditorArea').append(addEditorCurrentHtml);

	})

	//追加編集者‐ボタンをクリックする
	$('#delAddEditorBtn').click(function(){
		var addEditorAreaDivLength = $('#addEditorArea > div').length;
		var addEditorCurrentDivId = "addEditorDiv"+ addEditorAreaDivLength;
		$('#'+addEditorCurrentDivId).remove();
	})


	//追加読者+ボタンをクリックする
	$('#addAddReaderBtn').click(function(){

		var addReaderAreaDivLength = $('#addReaderArea > div').length;
		var addReaderCurrentDivId = "addReaderDiv"+ (addReaderAreaDivLength + 1);
		var addReaderCurrentInputTextName = "1addReader"+"["+addReaderAreaDivLength+"]";

		var addReaderCurrentHtml=

			"<div id=\""+addReaderCurrentDivId+"\" class=\"ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-1\">\r\n" +
			"                    	<div class=\"ds-col-md-3\">\r\n" +
			"                    		 <div class=\"ds-input-container ds-margin-bottom-2 ds-display-inline\">\r\n" +
			"                    		 	<span>追加読者Intranet ID【"+(addReaderAreaDivLength+1)+"】:</span>\r\n" +
			"                             </div>\r\n" +
			"                        </div>\r\n" +
			"                   	    <div class=\"ds-col-md-6\">\r\n" +
			"		                	 <input type=\"text\" class=\"ds-input \" value=\"\" name=\""+addReaderCurrentInputTextName+"\" id=\"form-address-line-1\" placeholder=\"\">\r\n" +
			"		              	</div>\r\n" +
			"                    </div>";
		$('#addReaderArea').append(addReaderCurrentHtml);

	})

	//追加読者-ボタンをクリックする
	$('#delAddReaderBtn').click(function(){
		var addReaderAreaDivLength = $('#addReaderArea > div').length;
		var addReaderCurrentDivId = "addReaderDiv"+ addReaderAreaDivLength;
		$('#'+addReaderCurrentDivId).remove();
	})

	//申請書更新画面のアップロードファイルの削除ボタンを押す
	var arrDel = new Array();
 	$("#upfileNameBeforeApproArea").on("click","input[type='button']",function(){

 			var hidVal=$(this).parent().find("input[type='hidden']").val();

 			arrDel.push(hidVal);

 			$('#deleteUpfileNameBeforeApproList').val(arrDel.join(","));

	        $(this).parent().parent().remove();
	})

//---------------------------Submitの処理------------------------------------------------------
 	function submitFun(){
 		var arrAddReader = new Array();
 		var arrAddEditor = new Array();
 		if($('#addReaderArea > div').length>0)
	 	{
		 	$('#addReaderArea > div').each(function(i){
					 var tempReader=$(this).find("input[type='text']").val();
					 if(tempReader != "")
					 {
						 arrAddReader.push(tempReader);
					 }

			});
		 	$("#addReader").val(arrAddReader.join(","));
	 	}
 		else
 		{
 			$("#addReader").val("");
 		}

 		if($('#addEditorArea > div').length>0)
	 	{
		 	$('#addEditorArea > div').each(function(i){
					 var tempEditor=$(this).find("input[type='text']").val();
					 if(tempEditor != "")
					 {
						 arrAddEditor.push(tempEditor);
					 }

			});
		 	$("#addEditor").val(arrAddEditor.join(","));
	 	}
 		else
 		{
 			$("#addEditor").val("");
 		}

	 	$("#hrRequestVo").submit();
 	}

	//申請書作成で保存ボタンを押す
// 	$("#btnSubmit").click(function(){
// 		var requestor = $('#requestor').val();
// 		var sealHolderId = $('#sealHolderId').val();
// 		if(requestor == sealHolderId)
// 			{
// 			var overlayElement = document.querySelector('#btnSubmit-overlay2')
// 	 		var myOverlay = w3ds.overlay(overlayElement)
// 	 		$("#saveSkipMsgDiv2").show();
// 	        myOverlay.open(overlayElement);
// 	        $('#requestor').remove();
// 			}
// 		else
// 			{
// 			var overlayElement = document.querySelector('#btnSubmit-overlay1')
// 	 		var myOverlay = w3ds.overlay(overlayElement)
// 	 		$("#saveSkipMsgDiv1").show();
// 	        myOverlay.open(overlayElement);
// 	        $('#requestor').remove();
// 			}
//
// 	})

 });

function init(){
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

	//入力チェックがエラーになった場合、返ってから選んだ書類情報を表示する
	docTitleListSelectShow('docTitle1','docTitleList1');
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
//    	      	 //"<tr><td>第二検証者ID:</td><td>"+vali2IdStr+"</td></tr>"+
//    	      	// "<tr><td>受付窓口ID:</td><td>"+receptionIdStr+"</td></tr>"+
//    	      "</table>";

    	   var appendHtml =
       	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
       	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印名：</span></div></div>"+
       	      	"<div class='ds-col-md-9 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.title+"</span></div>"+
       	      "</div>"+
      	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
       	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印保持者：</span></div></div>"+
       	      	"<div class='ds-col-md-9 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.holderName+"　"+obj.holderId+"</span></div>"+
       	      "</div>"+
     	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
  	  	      	"<div class='ds-col-md-3 ds-margin-bottom-1'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>代行者：</span></div></div>"+
  	  	      	"<div class='ds-col-md-9 ds-margin-bottom-1 ds-align-text-left  '><span>"+delegateIDStr+"</span></div>"+
  	  	      "</div>"+
     	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
  	  	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>事業部/カテゴリ：</span></div></div>"+
  	  	      	"<div class='ds-col-md-9 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.sector+"</span></div>"+
  	  	      "</div>"+
  	  	      "<div class='ds-row ds-margin-top-sm-1 ds-margin-bottom-sm-1 ds-margin-top-md-0 ds-margin-bottom-md-0'>"+
  	 	      	"<div class='ds-col-md-3'><div class='ds-input-container ds-margin-bottom-2 ds-display-inline'><span>公印管理番号：</span></div></div>"+
  	 	      	"<div class='ds-col-md-9 ds-margin-bottom-1 ds-align-text-left  '><span>"+obj.manageId+"</span></div>"+
  	 	      "</div>";

    	   $("#sealHolderId").val(obj.holderId);
    	   $("#sealsInfoSpan").append(appendHtml);
     	//Loading Spinner Hide
     	 $("#sealsTitleSpinner").hide();
       }
	 });
}

function sealsTitleChange(){
		 //sealsTitle Hiddenに値を与える
	     var sealsId = $('#sealsTitleSelect').val();
	     sealsInfoShow(sealsId);
	     $("#sealsId").val(sealsId);
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



//お客様名(表示)のロジック
function setCustomerVal()
{

	var customerBody = $('#customerBody').val();

	var customerStatus = $('#customerStatus').val();

	//.find("option:selected").text();
	if(customerStatus == "なし(NONE)")
	{

		$("#customer").val(customerBody);
		$("#customer_display").val(customerBody);
	}
	else
	{
		var customerStatusPos = $("input[name='customerStatusPos']:checked").val();

		if(customerStatusPos == "名前の前(左)")
		{
			var customerVal = customerStatus + " " +customerBody;
			$("#customer").val(customerVal);
			$("#customer_display").val(customerVal);
		}
		else if (customerStatusPos == "名前の後(右)")
		{
			var customerVal = customerBody + " " +customerStatus;
			$("#customer").val(customerVal);
			$("#customer_display").val(customerVal);
		}

	 }
}

//書類区分により、書式名称を表示する
function docTitleListSelectShow(docTitleSelectName,docTitleListSelectName){

	var sealFormCategory = $("#"+docTitleSelectName).val();
	var docTitleListName = $("#"+docTitleListSelectName).val();
	if(sealFormCategory == null || sealFormCategory == "")
	{
		$("#"+docTitleListSelectName).empty();
		$("#"+docTitleListSelectName).attr("disabled","disabled");
		$("#"+docTitleListSelectName).append("<option value='null'>書式を選択ください</option>");
		return;
	}

	$("#"+docTitleListSelectName).empty();
	$("#"+docTitleListSelectName).append("<option value=''>お待ちください。</option>");
	$("#"+docTitleListSelectName).attr("disabled","disabled");

	 $.ajax({
		 type: "POST",
		 url: encodeURI("seachSealFormInfo"),
		 data:{"sealFormCategory":encodeURI(sealFormCategory)},
		 contentType: "application/x-www-form-urlencoded; charset=utf-8",
		 async:true,
		 success: function(result){
	    	 var data = decodeURIComponent(result);
	    	 var data = data.replace(/\+/g, " ");
			 $("#"+docTitleListSelectName).removeAttr("disabled");
			 $("#"+docTitleListSelectName).empty();
			 var obj = jQuery.parseJSON(data);
	     	 $.each(obj, function(i,val){
	     		  $("#"+docTitleListSelectName).append("<option value='"+val.sealFormSubject+"'>"+val.sealFormSubject+ "( "+val.sealFormEvidenceTitle+ ")" + "</option>");
//	     		  $("#"+docTitleListSelectName).append("<option value='"+val.docId+"'>"+val.sealFormSubject+"</option>");
	     	 });
	     	 
	     	$("#"+ docTitleListSelectName +" option").each(function(i){
	     		if(docTitleListName == this.value)
	     		{
	     			this.selected = true;
	     		}
	     		});
		 }
	 });
}
