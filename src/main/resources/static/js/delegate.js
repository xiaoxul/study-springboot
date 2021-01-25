$(document).ready(function(){
	
	//Init設定
	$("#delegateID_select_div").show();
	$("#delegateID_input_div").hide();
	$("#delegateID_btn_div").hide();
	$("#delegateID_err_msg_div").hide();
		
	
	$("#delegateRange_select").change(function(){
		$("#delegateID_err_msg_div").hide();
		delegateRangeChange();
	})
	
	$("#delegateID_select").change(function(){
		$("#delegateID_err_msg_div").hide();
		delegateIDChange($("#delegateID_select").val());
	})
	
	$("#delegateID_btn").click(function(){
		$("#delegateID_err_msg_div").hide();
		delegateIDChange($("#delegateID_input").val());
	})
	
	$("#requestorID_btn").click(function(){
		$("#requestorID_err_msg_div").hide();
		requestorIDChange($("#requestorID_input").val());
	})	
	
	
	//代行者レベル選択時の処理
    function delegateRangeChange(callback) {
	var delegateRange = $('#delegateRange_select').val();
	
	//手動で入力する場合
	if (delegateRange == "5") {
		$("#delegateID_select_div").hide();
		$("#delegateID_input_div").show();
		$("#delegateID_btn_div").show();
		return;
	}
	else
		{
		$("#delegateID_select_div").show();
		$("#delegateID_input_div").hide();
		$("#delegateID_btn_div").hide();
		
			if (delegateRange == "1") {
				$("#delegateID_select").empty();
				$("#delegateID_select").attr("disabled", "disabled");
				$("#delegateID_select").append(
						"<option value='null'>代行者IDを選択ください</option>");
				return;
			}
		}
	
	var requestorID = $('#requestorID').val();
	
	$.ajax({
		type : "POST",
		url : encodeURI("searchDelegateID"),
		data : {
			"requestorID" : requestorID,
			"delegateRange" : delegateRange
		},
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		async : true
	}).done(
			function(data) {
				if (data != null && data != "") {
					$("#delegateID_select").removeAttr("disabled");
					$("#delegateID_select").empty();
					$("#delegateID_select").append(
							"<option value='null' selected>代行者IDを選択ください</option>");
					$.each(data, function(i, val) {
						if(val.mail != null && val.mail != "")
						{
							$("#delegateID_select").append(
									"<option value='" + val.mail + "'>" + val.mail
											+ "</option>");
						}
					})
				}else{
					$("#delegateID_select").removeAttr("disabled");
					$("#delegateID_select").empty();
					$("#delegateID_select").append(
							"<option value='null' selected>代行者IDはありません</option>");
				};
				if (callback != null && typeof(callback) == "function"){
					callback();
				}
				});
	$("#delegateID_select").empty();
	$("#delegateID_select").append(
			"<option value='null' selected>検索中、お待ちください</option>");
}
	
	
	//代行者選択時の処理
function delegateIDChange(email) {
	
	if (email == null || email == "null" || email == "") {
		return false;
	}
	
    $("#delegateID").val("");
    $("#delegateName").val("");

	$.ajax({
				type : "POST",
				url : encodeURI("../getBluePageInfo"),
				data : {
					"mailId" : email
				},
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				async : true,
				success : function(data) {
					if (data != null && data != "") {
						
                        //代行者の情報のセット
						$("#delegateID").val(data.mail);
						$("#delegateNotesID").val(data.notesId);
                        $("#delegateName").val(data.callUpName);
                        $("#delegateIbmSerialNumber").val(data.ibmSerialNumber);
                        $("#delegateDeptTitle").val(data.deptTitle);
                        $("#delegateDept").val(data.dept);
                        $('#delegateTieLine').val(data.tieLine);
                        $("#delegateTelephoneNumber").val(data.telephoneNumber);
                        $("#delegateJobResponsibilities").val(data.jobResponsibilities);
                        $("#delegateIsManager").val(data.isManager);
                        //代行者の画面表示のセット
						$("#delegateID_text").text(data.mail);
						$("#delegateName_text").text(data.callUpName);
						$("#delegateEmpNo_text").text(data.ibmSerialNumber);
						if(data.deptTitle == null || data.deptTitle == "")
						{
							$("#delegateDeptName_text").text("　");
						}
						else
						{
							$("#delegateDeptName_text").text(data.deptTitle);
						}
						if(data.dept == null || data.dept =="")
						{
							$("#delegateDeptCode_text").text("　");
						}
						else
						{
							$("#delegateDeptCode_text").text(data.dept);
						}
						if(data.jobResponsibilities == null || data.jobResponsibilities =="")
						{
							$("#delegateOccupName_text").text("　");
						}
						else
						{
							$("#delegateOccupName_text").text(data.jobResponsibilities);
						}

					} else {
						$("#delegateID_err_msg_div").show();
					}
				}
			});
	}

//申請者選択時の処理
function requestorIDChange(email) {
	
	if (email == null || email == "null" || email == "") {
		return false;
	}
	
    $("#requestorID").val("");
    $("#requestorName").val("");

	$.ajax({
				type : "POST",
				url : encodeURI("../getBluePageInfo"),
				data : {
					"mailId" : email
				},
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				async : true,
				success : function(data) {
					if (data != null && data != "") {
						
						//公印者の情報のセット
                        $("#requestorID").val(data.mail);
                        $("#requestorNotesID").val(data.notesId);
                        $("#requestorName").val(data.callUpName);
                        $("#requestorIbmSerialNumber").val(data.ibmSerialNumber);
                        $("#requestorDeptTitle").val(data.deptTitle);
                        $("#requestorDept").val(data.dept);
                        $("#requestorTelephoneNumber").val(data.telephoneNumber);
                        $('#requestorTieLine').val(data.tieLine);
                        $("#requestorJobResponsibilities").val(data.jobResponsibilities);
                        $("#requestorIsManager").val(data.isManager);
                        $('#requestorMgrNotesID').val(data.mgrNotesID);
                        //公印者の画面表示のセット
						$("#requestorID_text").text(data.mail);
						$("#requestorName_text").text(data.callUpName);
						$("#requestorEmpNo_text").text(data.ibmSerialNumber);
						if(data.deptTitle == null || data.deptTitle =="")
						{
							$("#requestorDeptName_text").text("　");
						}
						else
						{
							$("#requestorDeptName_text").text(data.deptTitle);
						}
						if(data.dept == null || data.dept =="")
						{
							$("#requestorDeptCode_text").text("　");
						}
						else
						{
							$("#requestorDeptCode_text").text(data.dept);
						}
						if(data.telephoneNumber == null || data.telephoneNumber == "")
						{
							$("#requestorTelNum_text").text("　");
						}
						else
						{
							$("#requestorTelNum_text").text(data.telephoneNumber);
						}
						if(data.jobResponsibilities == null || data.jobResponsibilities == "")
						{
							$("#requestorOccupName_text").text("　");
						}
						else
						{
							$("#requestorOccupName_text").text(data.jobResponsibilities);
						}
						
						//代行者選択をInit状態にさせる
						$('#delegateRange_select').val("1");
						delegateRangeChange();
					} else {
						$("#requestorID_err_msg_div").show();
					}
				}
			});
	}
})
