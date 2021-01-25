function GetDateDiff(startTime, endTime, diffType) {
            //形式のxxxx-xx-xxを xxxx/xx/xx転換 
            startTime = startTime.replace(/\-/g, "/");
            endTime = endTime.replace(/\-/g, "/");

            diffType = diffType.toLowerCase();
            var sTime = new Date(startTime);      //開始時間
            var eTime = new Date(endTime);  //完了時間
            
            var divNum = 1;
            switch (diffType) {
                case "second":
                    divNum = 1000;
                    break;
                case "minute":
                    divNum = 1000 * 60;
                    break;
                case "hour":
                    divNum = 1000 * 3600;
                    break;
                case "day":
                    divNum = 1000 * 3600 * 24;
                    break;
                default:
                    break;
            }
            return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum)) + 1 ;
        }

$(document).ready(function(){
	$("input[name='delegateStartDate']").change(function(){
		calculatedate();
	});
	$("input[name='delegateEndDate']").change(function(){
		calculatedate();
	})
})

//時間差を計算
function calculatedate(){
	setInterval(function(){
		var value = $("input[name='delegateDays']").val();
		var start = $("input[name='delegateStartDate']").val();
		var end = $("input[name='delegateEndDate']").val();
		if (start == "" || end == ""){
			$("input[name='delegateDays']").val("");
			return;
		}
		if (start > end){
			$("input[name='delegateDays']").val("");
			return;
		}
		var newValue = GetDateDiff(start, end, "day");
		if (newValue != value){
			$("input[name='delegateDays']").val(newValue);
		}
		
	},2000)
}