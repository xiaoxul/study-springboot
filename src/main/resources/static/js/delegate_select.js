function delegateRangeChange(callback) {
	var delegateRange = $('#delegateRange').val();
	var hoderManagerID = $('#hoderManagerID').val();

	if (delegateRange == "null") {
		$("#delegateID_select").empty();
		$("#delegateID_select").attr("disabled", "disabled");
		$("#delegateID_select").append(
				"<option value='null'>代行レベルを選択ください</option>");
		return;
	}

	$.ajax({
		type : "POST",
		url : encodeURI("searchDelegateID"),
		data : {
			"hoderManagerID" : hoderManagerID,
			"delegateRange" : delegateRange
		},
		// data: JSON.stringify(o),
		// contentType: "application/json; charset=utf-8",
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		async : true
	}).done(
			function(data) {
				$("#delegateID_select").removeAttr("disabled");
				$("#delegateID_select").empty();
				$("#delegateID_select").append(
						"<option value='null' selected>代行者IDを選択ください</option>");

				// var objArr = jQuery.parseJSON(data);

				$.each(data, function(i, val) {
					$("#delegateID_select").append(
							"<option value='" + val.mail + "'>" + val.mail
									+ "</option>");
				});
				if (callback != null && typeof(callback) == "function"){
					callback();
				}
			});

	$("#delegateID_select").empty();
	$("#delegateID_select").append(
			"<option value='null' selected>検索中、お待ちください</option>");

}

function delegateIDChange() {
	var email = $("#delegateID_select").val();
	$(".ibm-alert-link").each(function(i, v) {
		$(this).remove();
	})
	$("#delegateID").val("");
	$("#delegateName").val("");
	$("#delegateEmpNo").val("");
	$("#delegateDeptName").val("");
	$("#delegateDeptCode").val("");
	if (email == null || email == "null") {
		$("#delegateID_select")
				.parent()
				.after(
						"<span id=\"delegateID.errors\" class=\"ibm-item-note ibm-alert-link\">ID can not be blank</span>");
		return;
	}
	// $("#delegateID.errors").remove();

	$
			.ajax({
				type : "POST",
				url : encodeURI("searchDelegateInfo"),
				data : {
					"mailId" : email
				},
				contentType : "application/x-www-form-urlencoded; charset=utf-8",
				async : false,
				success : function(data) {
					if (data != null && data != "") {
						alert(data);
						$("#delegateID").val(data.mail);
						$("#delegateName").val(data.callUpName);
						$("#delegateEmpNo").val(data.ibmSerialNumber);
						$("#delegateDeptName").val(data.deptTitle);
						$("#delegateDeptCode").val(data.dept);
					} else {
						// $("#delegateName").val("");
						// $("#delegateDeptCode").val("");
						$("#delegateID_select")
								.parent()
								.after(
										"<span id=\"delegateID.errors\" class=\"ibm-item-note ibm-alert-link\">ID can not be blank</span>");
					}
				}
			});
}

function isEmail(strEmail) {
	if (strEmail
			.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1) {
		return true;
	} else {
		return false;
	}
}