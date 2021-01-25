//todo: different email sender for internal and different label sender for DNS vs URT
//todo: ? must be no no expiration date option for w3 - to be discussed first before implementing
//todo: w3 records switch
//todo: check RE api for w3 - shoud not be sending anything to RE
//todo: fix sync with RE
//todo: migration data
//todo: if the record is going to expire, and it has noone, it should send high priority email to cwt so that it is not missed

//todo: display notiifed people via pattern in ticket
//todo: different photo for systemID user
//todo: backend check for older revision being pending and block newer

//bin, delete or revision
//sync with RE rework to make it work properly and not corrupt stuff
var redirectRequest_addedURLS = {};
var redirectRequest_addedDNS = {};
var popUpType;
var popUpCallBackFunction;
var warningType;
var warningContinueFunction;

var clickedTimes = 0;

var maxURLRedirects = 200;

var savedSearchString = "";
var exportSearchRecords = [];

var messages_message_HTML;
var messages_title_HTML;
var messages_delete_HTML;

var taskProgressInterval;

var blockPattern_pattern_HTML;
var notifPattern_pattern_HTML;
var userGroupsPattern_pattern_HTML;
var userGroupsAddPattern_pattern_HTML;
var blockPattern_comment_HTML;
var notifPattern_comment_HTML;
var blockPattern_type_HTML;
var notifPattern_type_HTML;
var userGroupsPattern_type_HTML;
var userGroupsAddPattern_type_HTML;
var notifPattern_people_HTML;
var userGroupsPattern_group_HTML;
var userGroupsAddPattern_group_HTML;
var blockPattern_active_HTML;
var notifPattern_active_HTML;
var blockPattern_delete_HTML;
var notifPattern_delete_HTML;
var userGroupsPattern_delete_HTML;
var userGroupsAddPattern_delete_HTML;
var blockPattern_useIntersection_HTML;
var notifPattern_useIntersection_HTML;
var userGroupsPattern_useIntersection_HTML;
var userGroupsAddPattern_useIntersection_HTML;
var emailAttachments = [];
var tabAdminSelectedID;
var tableAdminStatusLog_interval;
var asGroup;

var groupSettings_id_HTML;
var groupSettings_approvelevel_HTML;
var groupSettings_name_HTML;
var groupSettings_approve_redirects_active_HTML;

var groupSettings_internal_redirect_approver_HTML;
var groupSettings_external_redirect_approver_HTML;

var groupSettings_approve_deletion_redirects_active_HTML;
var groupSettings_approve_routing_redirects_active_HTML;
var groupSettings_namings_approval_needed_active_HTML;


var groupSettings_dns_add_approval_needed_active_HTML;
var groupSettings_dns_modify_approval_needed_active_HTML;
var groupSettings_dns_delete_approval_needed_active_HTML;
var groupSettings_dns_a_approval_needed_active_HTML;
var groupSettings_dns_cname_approval_needed_active_HTML;
var groupSettings_dns_aaaa_approval_needed_active_HTML;
var groupSettings_dns_txt_approval_needed_active_HTML;
var groupSettings_dns_mx_approval_needed_active_HTML;

var groupSettings_notify_members_via_email_active_HTML;
var groupSettings_optional_active_HTML;
var groupSettings_optional_only_one_contact_active_HTML;
var groupSettings_only_approval_for_its_patterns_active_HTML;
var groupSettings_add_approval_for_its_patterns_active_HTML;
var groupSettings_disable_buttons_when_not_in_queue_active_HTML;
var groupSettings_delete_HTML;

var deleteURLListType = false;
var deleteURLList_currentTrashButton = null;
var addedUrlsListWidth = 0;
var addedUrlsColumnTitles  = $('.ds-row.columnTitles')
var addedUrlsList = $('.addedUrlsList.editMode');

var chart1;
var chart2;
var chartOptions =
{
    "width": "100%",
    "height": 330,
    "is3D": true,
    'chartArea': {'width': '100%', 'height': '80%'},
    "backgroundColor": '#FDFDFD',
    "sliceVisibilityThreshold": 0
};

var doNotValidate = false;
//var radioTo = '';

function showLoader(text)
{
    $("#loader #loaderText").html(text);
    $("#loader").fadeIn(250);
    $("#mainContainer").addClass("blur");
}

function getRegex101Link(regex,subst,testString,elem)
{
    $.post(prefixPath+"/API/getRegex101.php", {regex: regex, substitution: subst, testString: testString}, function( data ) {
        data = JSON.parse(data);
        elem.removeAttribute("data-loading");
        var win = window.open("https://regex101.com/r/"+data.data+"/1/", '_blank');
        win.focus();
    });
}

var regexLinkClick = function()
{
    if(typeof $(this).data("loading") == "undefined" || $(this).data("loading") != "yes")
    {
        if(clickedTimes > 4)
        {
            this.setAttribute('data-loading', "yes");
            getRegex101Link($($(this).parent().parent().find("td")[1]).text(),$($(this).parent().parent().find("td")[2]).text(),"",this);
        }

        clickedTimes++;
        setTimeout(function()
        {
            clickedTimes = 0;
        }, 3000);
    }
}

function genFilterString(searchString,mainFilter,remove,value)
{
    var beforeFilters = searchString.split("filters:")[0].trim();
    var filters = searchString.split("filters:")[1];

    var valueDivider = ",-ulOisjqDvgwCPUZl-,";
    var divider = ",-VLe7b6SopaudWyj1-,";

    value = value || false;

    if(typeof filters == "undefined")
    {
        filters = "";
        var filterEntries = [];
    }
    else
    {
        var filterEntries = filters.split(divider);
    }

    for(var i in filterEntries)
    {
        if(remove)
        {
            //delete previous
            var parts = filterEntries[i].split(valueDivider);
            if(parts[0] == mainFilter)
            {
                filterEntries.splice(i, 1);
            }
        }
        else
        {
            //delete previous first
            var parts = filterEntries[i].split(valueDivider);

            if(parts[0] == mainFilter)
            {
                filterEntries.splice(i, 1);
            }
        }
    }
    //add new now
    if(!remove)
    {
        if(value)
        {
            filterEntries.push(mainFilter+valueDivider+value);
        }
        else
        {
            filterEntries.push(mainFilter);
        }
    }
    filters = "";

    for(var i in filterEntries)
    {
        if(filterEntries[i] != "")
        {
            filters+=filterEntries[i]+divider;
        }
    }

    filters = filters.trim();
    if(filters != "")
    {
        if(beforeFilters.trim() != "")
        {
            var finalString = beforeFilters.trim()+" filters:"+filters;
        }
        else
        {
            var finalString = "filters:"+filters;
        }
    }
    else
    {
        var finalString = beforeFilters.trim();
    }
    return finalString;
}

function hideLoader()
{
    $("#loader").fadeOut(250);
    $("#mainContainer").removeClass("blur");
}

function showBlur()
{
    $("#mainContainer").addClass("blur");
}

function removeBlur()
{
    $("#mainContainer").removeClass("blur");
}
function closeWarning()
{
    var warningElem = $("#warningContainer");
    warningElem.fadeOut(250);
    removeBlur();
    $('html, body').css({
        overflow: 'auto'
    });
}
/* Usage:

    var testFunc1 = function(){
        alert("1");
    }
    showWarning("test","test2","1",testFunc1);

*/
function showWarning(title,message,warningTypeLocal,continueFunc)
{
    var warningElem = $("#warningContainer");
    var warningTitle = warningElem.find("#warningTitle");
    var warningMessage = warningElem.find("#warningMessage");
    if(warningType !== warningTypeLocal)
    {
        warningMessage.val("");
    }
    warningType = warningTypeLocal;

    warningElem.css("display", "flex")
    .hide()
    .fadeIn(250);
    warningTitle.html(title);
    warningMessage.html(message);
    showBlur();
    $('html, body').css({
        overflow: 'hidden'
    });

    $("#warningSubmitButton").unbind( "click", warningContinueFunction);
    warningContinueFunction = continueFunc;
    $("#warningSubmitButton").bind( "click", warningContinueFunction);
}

function showPopUp(title,placeholderTextArea,popUpTypeLocal,localCallBackFunction,customContent)
{
    var popUpElem = $("#popUpContainer");
    var popUpTitle = popUpElem.find("#popUpTitle");
    var popUpTextArea = popUpElem.find("#popUpTextArea");
    var popUpCustomContent = popUpElem.find("#popUpCustomContent");
    popUpCustomContent.html("");

    if(popUpType !== popUpTypeLocal)
    {
        popUpTextArea.val("");
    }
    localCallBackFunction = localCallBackFunction || false;
    customContent = customContent || false;
    if(customContent)
    {
        popUpCustomContent.html(customContent);
    }
    popUpCallBackFunction = localCallBackFunction;

    popUpType = popUpTypeLocal;
    popUpElem.css("display", "flex")
    .hide()
    .fadeIn(250);
    popUpTitle.html(title);
    popUpTextArea.attr("placeholder", placeholderTextArea);
    showBlur();
    $('html, body').css({
        overflow: 'hidden'
    });
}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

function closePopUp()
{
    var popUpElem = $("#popUpContainer");
    popUpElem.fadeOut(250);
    removeBlur();
    $('html, body').css({
        overflow: 'auto'
    });
}

function processSiteChoiceRadioButtons(eventClick)
{
    var trademarkDefault = ' As the submitter of the redirect request I confirm that the URL has been reviewed for possible conflicts with other companies&apos; trademarks and service marks on a worldwide basis. I confirm that the URL contains no known service mark or trademark violations.';
    var trademarkW3 = ' I ASSERT PER IBM BUSINESS CONDUCT GUIDELINES that all information I have provided is accurate, complete and honest. I have made no deliberate misrepresentations, misleading or dishonest statements, and have not omitted any data. The application and associated URL(s) have been thoroughly reviewed for possible conflicts with other companies&apos; trademarks and service marks on a worldwide basis; the application and associated URL(s) contain no known service mark or trademark violations.';
    var batchPlaceholderDefault = "//www.ibm.com/source1 //www.ibm.com/target1 301\n//www.ibm.com/source3/ //www.ibm.com/target1/{cc/lc=ca/en,ca/fr;default=ca/en}/ 301 SUBST";
    var batchPlaceholderW3 = "//w3.ibm.com/source1 //w3.ibm.com/target1 301\n//w3.ibm.com/source3/ //w3.ibm.com/target1/{cc/lc=ca/en,ca/fr;default=ca/en}/ 301 SUBST";

    var requestTypeChoice = $("[name='request-type-choice']:checked");

    if(requestTypeChoice.attr("id") !== "request-type-routing")
    {
        var redirectRequest_addedURLS_Count = Object.keys(redirectRequest_addedURLS).length;
        if (redirectRequest_addedURLS_Count > 0) {
            $(".addedRedirectsTitle").show();
        }
        eventClick = typeof eventClick !== 'undefined' ? eventClick : false;
        if(redirectRequest_addedURLS_Count > 0 || window.location.href.endsWith("/internal") || window.location.href.endsWith("/external"))
        {
            if(eventClick !== false)
            {
                eventClick.preventDefault();
            }
            $("[name='request-site-choice']").prop("disabled",true);
            $("[name='request-site-choice']").addClass("ds-disabled");
        }
        else
        {
            $("[name='request-site-choice']").prop("disabled",false);
            $("[name='request-site-choice']").removeClass("ds-disabled");
        }
        var _this = $("[name='request-site-choice']:checked");
        var sourceURLContainer = $("#source-url-container");
        var targetURLContainer = $("#target-url-container");
        var labelIMAP = $('label[for=imap-number]');
        switch (_this.attr("id")) {
            case "request-site-w3":
                $('#w3-instructions').show();
                sourceURLContainer.find("input").attr("placeholder","//w3.ibm.com/abc");
                targetURLContainer.find("input").attr("placeholder","//w3.ibm.com/def");
                $('#addedUrlsListArea').attr("placeholder",batchPlaceholderW3);
                $('#trademark-investigation~.ds-label-small').html(trademarkW3);
                $("#billing-section-details").hide();
                labelIMAP.html('*IMAP NUMBER');
                var imapInputRow = labelIMAP.closest('[class*=ds-row]').children(':last-child');
                $('<div id="w3-imap-caption" class="ds-col-12"><p class="ds-caption">IMAP is required, if not specified, fill in comment section with reason</p></div>').insertBefore(imapInputRow);
                break;
            case "request-site-ibm":
                $('#w3-instructions').hide();
                sourceURLContainer.find("input").attr("placeholder","//www.ibm.com/abc");
                targetURLContainer.find("input").attr("placeholder","//www.ibm.com/def");
                $('#addedUrlsListArea').attr("placeholder",batchPlaceholderDefault);
                $('#trademark-investigation~.ds-label-small').html(trademarkDefault);
                $("#billing-section-details").show();
                labelIMAP.html('IMAP NUMBER');
                $('#w3-imap-caption').remove();
                break;
            case "request-site-other":
                $('#w3-instructions').hide();labelIMAP.siblings('.ds-caption').remove();
                sourceURLContainer.find("input").attr("placeholder","//www.example.com/abc");
                targetURLContainer.find("input").attr("placeholder","//www.example.com/def");
                $('#addedUrlsListArea').attr("placeholder",batchPlaceholderDefault);
                $('#trademark-investigation~.ds-label-small').html(trademarkDefault);
                $("#billing-section-details").show();
                labelIMAP.html('IMAP NUMBER');
                $('#w3-imap-caption').remove();
                break;
        }
    }
}

function processRequestChoiceRadioButtons(fromInit)
{
    fromInit = typeof fromInit !== 'undefined' ? fromInit : false;
    var _this = $("[name='request-type-choice']:checked");
    var targetURLContainer = $("#target-url-container");
    var flagContainer = $("#flag-container");
    var substitutionContainer = $("#substitution-container");
    var regexContainer = $("#regex-container");
    var dns_action = $("[name='request-action-choice']:checked");
    var reverseRequiredContainer = $("#reverseRequiredContainer");
    var dns_data_label = $("#dns_data_label");
    var dns_data_2_container = $("#dns_data_2_container");

    var hasStatusCode = false;
    $.each(redirectRequest_addedURLS, function(key, value) {
        if(value.statusCode !== "")
        {
            hasStatusCode = true;
        }
    });

    switch (_this.attr("id")) {
        case "request-type-redirect":
            targetURLContainer.show();
            flagContainer.show();
            substitutionContainer.hide();
            break;
        case "request-type-naming":
        case "request-type-deletion":
            targetURLContainer.hide();
            flagContainer.hide();
            break;
        case "request-type-routing":
            //if for whatever reason we have flag in routing while editing, do not hide the field
            if(!hasStatusCode)
            {
                flagContainer.hide();
            }
            else
            {
                $($("#target-url-container").children()[1]).children().addClass("ds-margin-bottom-0").children().addClass("ds-margin-bottom-0");
            }


            targetURLContainer.show();
            break;
        case "request-type-a":
            reverseRequiredContainer.show();
            dns_data_label.html("*IPv4 Address");
            dns_data_2_container.hide();
            $("#dns_data").attr("placeholder","127.0.0.1");
            break;
        case "request-type-aaaa":
            reverseRequiredContainer.show();
            dns_data_label.html("*IPv6 Address");
            dns_data_2_container.hide();
            $("#dns_data").attr("placeholder","2001:0db8:85a3:0000:0000:8a2e:0370:7334");
            break;
        case "request-type-cname":
            reverseRequiredContainer.hide();
            dns_data_label.html("*Alias");
            dns_data_2_container.hide();
            $("#dns_data").attr("placeholder","cname.ibm.com");
            break;
        case "request-type-txt":
            reverseRequiredContainer.hide();
            dns_data_label.html("*Text");
            dns_data_2_container.hide();
            $("#dns_data").attr("placeholder","Some text here");
            break;
        case "request-type-mx":
            reverseRequiredContainer.hide();
            dns_data_label.html("*Priority");
            dns_data_2_container.hide();
            $("#dns_data").attr("placeholder","10");
            break;
    }


}

function processUBIRadioButtons()
{
    var _this = $("[name='user-ubi-choice']:checked");

    var userHasUbiContainer = $("#user-has-ubi-container");
    var userCreateUbiContainer = $("#user-create-ubi-container");
    var userHasUbiExemption = $("#user-has-ubi-exemption");

    switch (_this.attr("id")) {
        case "user-has-ubi":
            userCreateUbiContainer.find("input").prop( "disabled", true );
            userCreateUbiContainer.find("input").addClass("ds-disabled");
            userCreateUbiContainer.hide();

            userHasUbiExemption.find("input").prop( "disabled", true );
            userHasUbiExemption.find("input").addClass("ds-disabled");
            userHasUbiExemption.hide();

            //userHasUbiContainer.find("input").prop( "disabled", false );
            //userHasUbiContainer.find("input").removeClass("ds-disabled");
            userHasUbiContainer.fadeIn(250);
            break;
        case "user-create-ubi":
            userCreateUbiContainer.find("input").prop( "disabled", false );
            userCreateUbiContainer.find("input").removeClass("ds-disabled");
            userCreateUbiContainer.fadeIn(250);

            userHasUbiExemption.find("input").prop( "disabled", true );
            userHasUbiExemption.find("input").addClass("ds-disabled");
            userHasUbiExemption.hide();

            //userHasUbiContainer.find("input").prop( "disabled", true );
            //userHasUbiContainer.find("input").addClass("ds-disabled");
            userHasUbiContainer.hide();
            break;
        case "user-exemption-ubi":
            //userHasUbiContainer.find("input").prop( "disabled", true );
            //userHasUbiContainer.find("input").addClass("ds-disabled");
            userHasUbiContainer.hide();

            userCreateUbiContainer.find("input").prop( "disabled", true );
            userCreateUbiContainer.find("input").addClass("ds-disabled");
            userCreateUbiContainer.hide();

            userHasUbiExemption.find("input").prop( "disabled", false );
            userHasUbiExemption.find("input").removeClass("ds-disabled");
            userHasUbiExemption.show();
    }
}



//all onClick functions here
var copyContentClick = function(e) {
    var content = $(this).data("content");

    var tmpTextArea = $("<textarea style='position:fixed; top:-100%;'></textarea>");
    $("body").append(tmpTextArea);
    tmpTextArea.html(content);
    tmpTextArea.select();

    try {
        var successful = document.execCommand('copy');

        if (successful) {
            alert("E-mail "+content+" copied.");
        }

    } catch (err) {
        //alert('Oops, unable to copy');
    }
    tmpTextArea.remove();
};

var saveBlockPatternClick = function(e)
{
    var rows = $("#blockPatterns_wrapper").find("tr");

    var blockPatternsData = [];

    for(var i = 1; i < rows.length; i++)
    {
        blockPatternsData[i-1] = {};
        blockPatternsData[i-1]["pattern"] = $($(rows[i]).find("td")[0]).find("input").val();
        blockPatternsData[i-1]["description"] = $($(rows[i]).find("td")[1]).find("textarea").val();
        blockPatternsData[i-1]["type"] = $($(rows[i]).find("td")[2]).find("select").val();
        blockPatternsData[i-1]["active"] = ($($($(rows[i]).find("td")[3]).find("input")[0]).is(':checked') ? "1" : "0");
        blockPatternsData[i-1]["useRegexIntersection"] = ($($($(rows[i]).find("td")[3]).find("input")[1]).is(':checked') ? "1" : "0");
    }
    var postData = JSON.stringify(blockPatternsData);
    showLoader("Saving block patterns...")
    $.post( prefixPath+"API/updateBlockPatterns.php",{data:postData})
    .done(function( data ) {
        var objData = JSON.parse(data);
        if(objData.success)
        {
            hideLoader();
            showNotice("success","Blocked patterns updated",objData.message,false);
            setTimeout(function(){
                closeNotice();
            },2500)
        }
        else
        {
            hideLoader();
            showNotice("error","Error",objData.message);
        }
    });
};

var saveNotifPatternClick = function(e)
{
    var rows = $("#notifPatterns_wrapper").find("tr");

    var notifPatternsData = [];

    for(var i = 1; i < rows.length; i++)
    {
        notifPatternsData[i-1] = {};
        notifPatternsData[i-1]["pattern"] = $($(rows[i]).find("td")[0]).find("input").val();
        notifPatternsData[i-1]["description"] = $($(rows[i]).find("td")[1]).find("textarea").val();
        notifPatternsData[i-1]["type"] = $($(rows[i]).find("td")[2]).find("select").val();
        notifPatternsData[i-1]["users"] = $($(rows[i]).find("td")[3]).find("input").val();
        notifPatternsData[i-1]["active"] = ($($($(rows[i]).find("td")[5]).find("input")[0]).is(':checked') ? "1" : "0");
        notifPatternsData[i-1]["matchingAlgorithm"] = $($(rows[i]).find("td")[4]).find("select").val();
    }

    var postData = JSON.stringify(notifPatternsData);
    showLoader("Saving notification patterns...")
    $.post( prefixPath+"API/updateNotifPatterns.php",{data:postData})
    .done(function( data ) {
        var objData = JSON.parse(data);
        if(objData.success)
        {
            hideLoader();
            showNotice("success","Notification patterns updated",objData.message,false);
            setTimeout(function(){
                closeNotice();
            },2500)
        }
        else
        {
            hideLoader();
            showNotice("error","Error",objData.message);
        }
    });
}

var saveUserGroupsPatternClick = function(e)
{
    var rows = $("#userGroupsPatterns_wrapper").find("tr");

    var userGroupsPatternsData = [];

    for(var i = 1; i < rows.length; i++)
    {
        userGroupsPatternsData[i-1] = {};
        userGroupsPatternsData[i-1]["pattern"] = $($(rows[i]).find("td")[0]).find("input").val();
        userGroupsPatternsData[i-1]["type"] = $($(rows[i]).find("td")[1]).find("select").val();
        userGroupsPatternsData[i-1]["group_id"] = $($(rows[i]).find("td")[2]).find("select").val();
        userGroupsPatternsData[i-1]["useRegexIntersection"] = ($($($(rows[i]).find("td")[2]).find("input")[0]).is(':checked') ? "1" : "0");
    }

    var postData = JSON.stringify(userGroupsPatternsData);
    showLoader("Saving user groups patterns...")
    $.post( prefixPath+"API/updateUserGroupsPatterns.php",{data:postData})
    .done(function( data ) {
        var objData = JSON.parse(data);
        if(objData.success)
        {
            hideLoader();
            showNotice("success","User groups patterns updated",objData.message,false);
            setTimeout(function(){
                closeNotice();
            },2500)
        }
        else
        {
            hideLoader();
            showNotice("error","Error",objData.message);
        }
    });

};

var saveUserGroupsAddPatternClick = function(e)
{
    var rows = $("#userGroupsAddPatterns_wrapper").find("tr");

    var userGroupsAddPatternsData = [];

    for(var i = 1; i < rows.length; i++)
    {
        userGroupsAddPatternsData[i-1] = {};
        userGroupsAddPatternsData[i-1]["pattern"] = $($(rows[i]).find("td")[0]).find("input").val();
        userGroupsAddPatternsData[i-1]["type"] = $($(rows[i]).find("td")[1]).find("select").val();
        userGroupsAddPatternsData[i-1]["group_id"] = $($(rows[i]).find("td")[2]).find("select").val();
        userGroupsAddPatternsData[i-1]["useRegexIntersection"] = ($($($(rows[i]).find("td")[2]).find("input")[0]).is(':checked') ? "1" : "0");
    }

    var postData = JSON.stringify(userGroupsAddPatternsData);
    showLoader("Saving user groups add patterns...")
    $.post( prefixPath+"API/updateUserGroupsAddPatterns.php",{data:postData})
    .done(function( data ) {
        var objData = JSON.parse(data);
        if(objData.success)
        {
            hideLoader();
            showNotice("success","User groups add patterns updated",objData.message,false);
            setTimeout(function(){
                closeNotice();
            },2500)
        }
        else
        {
            hideLoader();
            showNotice("error","Error",objData.message);
        }
    });

};

var saveGroupSettingsClick = function(e)
{
    var rows = $("#groupSettings_wrapper").find("tr");

    var gotIDs = [];

    var groupSettingsData = [];

    var duplicates = false;
    for(var i = 1; i < rows.length; i++)
    {
        groupSettingsData[i-1] = {};
        groupSettingsData[i-1]["id"] = $($(rows[i]).find("td")[0]).find("input").val();
        groupSettingsData[i-1]["approvelevel"] = $($(rows[i]).find("td")[1]).find("input").val();
        groupSettingsData[i-1]["name"] = $($(rows[i]).find("td")[2]).find("input").val();


        groupSettingsData[i-1]["internal_redirect_approver"] = ($($(rows[i]).find("td")[3]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["external_redirect_approver"] = ($($(rows[i]).find("td")[4]).find("input").is(':checked') ? "1" : "0");

        groupSettingsData[i-1]["redirects_approval_needed"] = ($($(rows[i]).find("td")[5]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["redirects_routing_approval_needed"] = ($($(rows[i]).find("td")[6]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["redirects_deletion_approval_needed"] = ($($(rows[i]).find("td")[7]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["namings_approval_needed"] = ($($(rows[i]).find("td")[8]).find("input").is(':checked') ? "1" : "0");

        groupSettingsData[i-1]["dns_add_approval_needed"] = ($($(rows[i]).find("td")[9]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["dns_modify_approval_needed"] = ($($(rows[i]).find("td")[10]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["dns_delete_approval_needed"] = ($($(rows[i]).find("td")[11]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["dns_a_approval_needed"] = ($($(rows[i]).find("td")[12]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["dns_cname_approval_needed"] = ($($(rows[i]).find("td")[13]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["dns_aaaa_approval_needed"] = ($($(rows[i]).find("td")[14]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["dns_txt_approval_needed"] = ($($(rows[i]).find("td")[15]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["dns_mx_approval_needed"] = ($($(rows[i]).find("td")[16]).find("input").is(':checked') ? "1" : "0");

        groupSettingsData[i-1]["notify_members_via_email"] = ($($(rows[i]).find("td")[17]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["optional"] = ($($(rows[i]).find("td")[18]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["optional_only_one_contact"] = ($($(rows[i]).find("td")[19]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["only_approval_for_its_patterns"] = ($($(rows[i]).find("td")[20]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["add_approval_for_its_patterns"] = ($($(rows[i]).find("td")[21]).find("input").is(':checked') ? "1" : "0");
        groupSettingsData[i-1]["disable_buttons_when_not_in_queue"] = ($($(rows[i]).find("td")[22]).find("input").is(':checked') ? "1" : "0");
        if(gotIDs.indexOf(groupSettingsData[i-1]["id"]) != -1)
        {
            duplicates = true;
            break;
        }
        else
        {
            gotIDs.push(groupSettingsData[i-1]["id"]);
        }
    }
    if(duplicates)
    {
        showNotice("error","Error","Each group has to have a unique ID");
    }
    else
    {
        var postData = JSON.stringify(groupSettingsData);
        showLoader("Saving group settings...");
        $.post( prefixPath+"API/updateGroupSettings.php",{data:postData})
            .done(function( data ) {
                var objData = JSON.parse(data);
                if(objData.success)
                {
                    hideLoader();
                    showNotice("success","Group settings updated",objData.message,false);
                    setTimeout(function(){
                        closeNotice();
                        location.reload();
                    },2500)
                }
                else
                {
                    hideLoader();
                    showNotice("error","Error",objData.message);
                    setTimeout(function(){
                        location.reload();
                    },5000);
                }
            });
    }
};

var savePredefinedMessagesClick = function(e)
{
    var groupPredefinedMessagesData = [];

    var i = 1;
    tableAdminPredefinedMessages.rows().eq(0).each( function ( index ) {
        var row = tableAdminPredefinedMessages.row( index );

        var data = row.data();

        groupPredefinedMessagesData[i-1] = {};
        groupPredefinedMessagesData[i-1]["title"] = $("#"+$(data[0]).find("input").attr("id")).val();
        groupPredefinedMessagesData[i-1]["message"] = $("#"+$(data[1]).find("textarea").attr("id")).val();
        i++;
    } );

    var postData = JSON.stringify(groupPredefinedMessagesData);
    showLoader("Saving group predefined messages...");
    $.post( prefixPath+"API/updateGroupPredefinedMessages.php",{data:postData,group_id:$("#predefinedGroupMessagesAdministration").val()})
        .done(function( data ) {
            var objData = JSON.parse(data);
            if(objData.success)
            {
                hideLoader();
                showNotice("success","Group user settings updated",objData.message,false);
                setTimeout(function(){
                    closeNotice();
                },2500);

                $("#userGroupAdministration").prop("disabled",false);
                $("#userGroupAdministration").removeClass("ds-disabled");
            }
            else
            {
                hideLoader();
                showNotice("error","Error",objData.message);
                setTimeout(function(){
                    location.reload();
                },5000);
            }
        });
};

var saveGroupUserSettingsClick = function(e)
{
    var groupSettingsUserData = [];

    var i = 1;
    tableAdminGroupSettingsUsers.rows().eq(0).each( function ( index ) {
        var row = tableAdminGroupSettingsUsers.row( index );

        var data = row.data();
        groupSettingsUserData[i-1] = {};
        groupSettingsUserData[i-1]["email"] = data[0];

        i++;
    } );

    var postData = JSON.stringify(groupSettingsUserData);
    showLoader("Saving group user settings...");
    $.post( prefixPath+"API/updateGroupUsersSettings.php",{data:postData,group_id:$("#userGroupAdministration").val()})
        .done(function( data ) {
            var objData = JSON.parse(data);
            if(objData.success)
            {
                hideLoader();
                showNotice("success","Group user settings updated",objData.message,false);
                setTimeout(function(){
                    closeNotice();
                },2500);

                $("#userGroupAdministration").prop("disabled",false);
                $("#userGroupAdministration").removeClass("ds-disabled");
            }
            else
            {
                hideLoader();
                showNotice("error","Error",objData.message);
                setTimeout(function(){
                    location.reload();
                },5000);
            }
        });
};

var saveGroupModuleSettingsClick = function(e)
{
    var rows = $("#groupSettings_modules_wrapper").find("tr");

    var groupSettingsModulesData = [];

    for(var i = 1; i < rows.length; i++)
    {
        groupSettingsModulesData[i-1] = {};
        groupSettingsModulesData[i-1]["name"] = $($(rows[i]).find("td")[0]).text();
        groupSettingsModulesData[i-1]["checked"] = $($(rows[i]).find("td")[1]).find("input").is(":checked");
    }

    var postData = JSON.stringify(groupSettingsModulesData);
    showLoader("Saving group permission settings...");
    $.post( prefixPath+"API/updateGroupPermissionSettings.php",{data:postData,group_id:$("#moduleGroupAdministration").val()})
        .done(function( data ) {
            var objData = JSON.parse(data);
            if(objData.success)
            {
                hideLoader();
                showNotice("success","Group permission settings updated",objData.message,false);
                setTimeout(function(){
                    closeNotice();
                },2500);

                $("#moduleGroupAdministration").prop("disabled",false);
                $("#moduleGroupAdministration").removeClass("ds-disabled");
            }
            else
            {
                hideLoader();
                showNotice("error","Error",objData.message);
                setTimeout(function(){
                    location.reload();
                },5000);
            }
        });
};

var addBlockPatternClick = function(e)
{
    e.preventDefault();

    //values generated from template.class.php
    tableAdminBlockingPatterns.row.add
    (
        [
            blockPattern_pattern_HTML,
            blockPattern_comment_HTML,
            blockPattern_type_HTML,
            blockPattern_active_HTML+blockPattern_useIntersection_HTML,
            blockPattern_delete_HTML
        ]
    ).draw();
    reReady();
};

var addPredefinedMessageClick = function(e)
{
    e.preventDefault();

    //values generated from template.class.php
    tableAdminPredefinedMessages.row.add
    (
        [
            messages_title_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE","messages_title_" + Date.now()),
            messages_message_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE","messages_message_" + Date.now()),
            messages_delete_HTML
        ]
    ).draw();
    reReady();
};

var addGroupClick = function(e)
{
    e.preventDefault();

    //values generated from template.class.php
    tableAdminGroupSettings.row.add
    (
        [
            groupSettings_id_HTML,
            groupSettings_approvelevel_HTML,
            groupSettings_name_HTML,
            groupSettings_internal_redirect_approver_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_external_redirect_approver_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_approve_redirects_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_approve_deletion_redirects_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_approve_routing_redirects_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_namings_approval_needed_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),

            groupSettings_dns_add_approval_needed_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_dns_modify_approval_needed_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_dns_delete_approval_needed_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_dns_a_approval_needed_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_dns_cname_approval_needed_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_dns_aaaa_approval_needed_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_dns_txt_approval_needed_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_dns_mx_approval_needed_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),

            groupSettings_notify_members_via_email_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_optional_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_optional_only_one_contact_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_only_approval_for_its_patterns_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_add_approval_for_its_patterns_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_disable_buttons_when_not_in_queue_active_HTML.replaceAll("REPLACE_UNIQUE_ID_HERE",Date.now()),
            groupSettings_delete_HTML
        ]
    ).draw();
    reReady();
};

var addNotifPatternClick = function(e)
{
    e.preventDefault();

    //values generated from template.class.php
    tableAdminNotifPatterns.row.add
    (
        [
            notifPattern_pattern_HTML,
            notifPattern_comment_HTML,
            notifPattern_type_HTML,
            notifPattern_people_HTML,
            notifPattern_useIntersection_HTML,
            notifPattern_active_HTML,
            notifPattern_delete_HTML
        ]
    ).draw();
    reReady();
};

var addUserGroupsPatternClick = function(e)
{
    e.preventDefault();

    //values generated from template.class.php
    tableAdminUserGroupsPatterns.row.add
    (
        [
            userGroupsPattern_pattern_HTML,
            userGroupsPattern_type_HTML,
            userGroupsPattern_group_HTML+userGroupsPattern_useIntersection_HTML,
            userGroupsPattern_delete_HTML
        ]
    ).draw();
    reReady();
};

var addUserGroupsPatternAddClick = function(e)
{
    e.preventDefault();

    //values generated from template.class.php
    tableAdminUserGroupsAddPatterns.row.add
    (
        [
            userGroupsAddPattern_pattern_HTML,
            userGroupsAddPattern_type_HTML,
            userGroupsAddPattern_group_HTML+userGroupsAddPattern_useIntersection_HTML,
            userGroupsAddPattern_delete_HTML
        ]
    ).draw();
    reReady();
};

var cancelBlockPatternClick = function(e)
{
    location.reload();
};

var cancelGroupSettingsClick = function(e)
{
    location.reload();
};

var addUserToGroupClick = function(e)
{
    e.preventDefault();


    //trash icon is in two places in this code!
    var callbackFunc = function(enteredString)
    {
        tableAdminGroupSettingsUsers.row.add
        (
            [
                enteredString,
                "-",
                '<div class="ds-input-container ds-margin-bottom-0 ds-padding-bottom-0 ds-align-text-right"><span class="ds-heading-4 ds-icon-trash-m groupSettingsUsers_delete"></span></div>'
            ]
        ).draw();
        $("#userGroupAdministration").prop("disabled",true);
        $("#userGroupAdministration").addClass("ds-disabled");
        reReady();
    };

    showPopUp("Add User","Enter user email","addUserToGroup",callbackFunc);
};

var cancelNotifPatternClick = function(e)
{
    location.reload();
};

var cancelUserGroupsPatternClick = function(e)
{
    location.reload();
};

var cancelUserGroupsAddPatternClick = function(e)
{
    location.reload();
};

var sourceURLVerifyClick = function(e)
{
    showLoader("Detecting redirects...");
    $.post( prefixPath+"/API/getRedirectTrail.php", { url: $("#sourceURL").val() } )
        .done(function( data ) {
            data = JSON.parse(data);
            if(data.success && data.data)
            {
                var outputText = "";
                for(var i = 0; i < data.data.length; i++)
                {
                    if(i !== 0)
                    {
                        outputText += ""
                    }
                    outputText += data.data[i] + "\n";
                }
                $("#sourceURLVerifyOutput").val(outputText);
                hideLoader();
            }
            else
            {
                hideLoader();
                showNotice("error","Error",data.message);
            }
        });

        /*
         $.post( prefixPath+"/API/generateRedirectURLS.php", { addedURLS: JSON.stringify(redirectRequest_addedURLS), urls: JSON.stringify(URLData) } )
        .done(function( data ) {
            data = JSON.parse(data);
            var success = true;
            for(var i = 0; i < data.length; i++)
            {
                if(data[i].success === false)
                {
                    success = false;
                }
            }

            data = data[0];
            if(success && data.data)
            {
                var gotData = data.data;
                if(gotData)
                {
                    var continueFunc = function() {
                        finalAddURLRedirect(gotData,generateTooltipHTML(typeText,typeIcon));
                        closeWarning();
                    };
                    hideLoader();
                    if(data.warning && data.message)
                    {
                        showWarning("Warning",data.message,"3",continueFunc);
                    }
                    else
                    {
                        continueFunc();
                    }
                    w3ds.init();

                }
                else
                {
                    hideLoader();
                    showNotice("error","Error","Application issue.<br/>Please report this bug to jnyiri@sk.ibm.com.");
                }
            }
            else
            {
                hideLoader();
                showNotice("error","Error",data.message);
            }
        });
*/
};

var messagesDeleteClick = function(e)
{
    e.preventDefault();
    $(this).parent().parent().parent().addClass("toBeDeleted"); //mark row as to be deleted

    var rows = tableAdminPredefinedMessages
    .rows( '.toBeDeleted' )
    .remove()
    .draw(); //remove the row

    reReady();
}

var deleteBlockPatternClick = function(e)
{
    e.preventDefault();
    $(this).parent().parent().parent().addClass("toBeDeleted"); //mark row as to be deleted

    var rows = tableAdminBlockingPatterns
    .rows( '.toBeDeleted' )
    .remove()
    .draw(); //remove the row

    reReady();
};

var deleteGroupClick = function(e)
{
    var _this = this;
    e.preventDefault();

    var continueFunc = function() {
        closeWarning();
        e.preventDefault();
        $(_this).parent().parent().parent().addClass("toBeDeleted"); //mark row as to be deleted

        var rows = tableAdminGroupSettings
            .rows( '.toBeDeleted' )
            .remove()
            .draw(); //remove the row

        reReady();
    };
    var groupName = $($(_this).parent().parent().parent().find("td")[2]).find("input").val();
    showWarning("Careful! Deleting group " + htmlEntities(groupName),"<span style='font-weight:bold;'>Are you sure you wish to delete group " +htmlEntities(groupName) + "?</span><br/>You can choose to transfer this group unique ID to other group after deleting.<br/><br/>Following group belongings will be affected:<br/>- users<br/>- permissions<br/>- patterns<br/>- approvals<br/><br/>If you assign the same ID to another group<br/> - group belongings will be transfered to the group you assigned ID to.<br/><br/>If you do not assign this ID to any other group:<br/> - group belongings of this group will be deleted, in case of users, their group will be changed to default group.","2",continueFunc);

};

var deleteGroupUserClick = function(e)
{
    var _this = this;

    e.preventDefault();
    $(_this).parent().parent().parent().addClass("toBeDeleted"); //mark row as to be deleted

    var rows = tableAdminGroupSettingsUsers
        .rows( '.toBeDeleted' )
        .remove()
        .draw(); //remove the row

    $("#userGroupAdministration").prop("disabled",true);
    $("#userGroupAdministration").addClass("ds-disabled");

    reReady();

};

var groupSettings_modulesChange = function(e)
{
    $("#moduleGroupAdministration").prop("disabled",true);
    $("#moduleGroupAdministration").addClass("ds-disabled");
};

var dnsDomainChange = function(e)
{
    var val = $(this).val();
    if(val == "")
    {
        $("#hostname").attr("placeholder","subdomain.ibm.com");
    }
    else
    {
        $("#hostname").attr("placeholder","subdomain."+val);
    }
}


var sourceUrlChange = function(e)
{
    var val = $("#source-url").val();
    if(val.indexOf("w3.ibm.com") != -1)
    {
        $("#request-site-w3").prop("checked",true);
    }
    else if(val.indexOf("www.ibm.com") != -1)
    {
        $("#request-site-ibm").prop("checked",true);
    }
}

var targetUrlChange = function(e)
{
    //placeholder
}

var predefinedGroupMessagesAdministrationChange = function(e)
{
    var predefinedMessagesWrapper = $("#predefinedMessages_wrapper");

    var tableHTML = '<table class="ds-table order-column stripe" id="predefinedMessages"><thead><tr><th>Title</th><th>Message</th><th class="ds-align-text-right">Actions</th></tr></thead><tbody>';

    showLoader("Getting group predefined messages...");
    $.post( prefixPath+"/API/getGroupPredefinedMessages.php", { group_id: $(this).val() } )
        .done(function( data ) {
            hideLoader();
            var objData = JSON.parse(data);
            if(objData.success)
            {
                if(typeof objData.data != "undefined")
                {
                    for(var i = 0; i < objData.data.length; i++)
                    {
                        tableHTML += "<tr>";

                        tableHTML += "<td>";
                        tableHTML += '<div class="ds-input-container ds-margin-bottom-0 ds-padding-bottom-0">';
                        tableHTML += '<input class="ds-input" name="messages_title" id="message_title_'+i+'" value="'+htmlEntities(objData.data[i].title)+'" />';
                        tableHTML += '</div>';
                        tableHTML += "</td>";

                        tableHTML += "<td>";

                        tableHTML += '<div class="ds-input-container ds-margin-bottom-0 ds-padding-bottom-0">';
                        tableHTML += '<textarea class="ds-input" name="messages_message" id="message_'+i+'">';
                        tableHTML += htmlEntities(objData.data[i].message);
                        tableHTML += '</textarea>';
                        tableHTML += '</div>';

                        tableHTML += "</td>";

                        //trash icon is in two places in this code!
                        tableHTML += "<td style='1%'>";
                        tableHTML += '<div class="ds-input-container ds-margin-bottom-0 ds-padding-bottom-0 ds-align-text-right">';
                        tableHTML += '    <span class="ds-heading-4 ds-icon-trash-m" name="messages_delete"></span>';
                        tableHTML += '</div>';
                        tableHTML += "</td>";
                        tableHTML += "</tr>";
                    }
                }


                tableHTML += '</tbody> </table>';

                predefinedMessagesWrapper.html(tableHTML);

                //this is in two places, with the same settings
                tableAdminPredefinedMessages = $('#predefinedMessages').DataTable( {
                    serverSide: false,
                    "order":
                    [
                        [ 1, "asc" ]
                    ],
                    "bPaginate": false,
                    responsive: true,
                    "bInfo" : false,
                    searching: false,
                    "ordering": false
                } );

                $(".addPredefinedMessage").removeClass("ds-disabled");
                $(".addPredefinedMessage").prop('disabled', false);

                $(".savePredefinedMessages").removeClass("ds-disabled");
                $(".savePredefinedMessages").prop('disabled', false);

                reReady();

            }
            else
            {
                showNotice("error","Error",objData.message);
            }
        });

};

var userGroupAdministrationChange = function(e)
{
    var groupSettingsUserWrapper = $("#groupSettings_users_wrapper");

    var tableHTML = '<table class="ds-table order-column stripe" id="groupSettings_users"> <thead> <tr> <th>Email</th><th>Name</th><th class="ds-align-text-right">Actions</th> </tr> </thead> <tbody>';

    showLoader("Getting group data...");
    $.post( prefixPath+"/API/getGroupMembers.php", { group_id: $(this).val() } )
        .done(function( data ) {
            hideLoader();
            var objData = JSON.parse(data);
            if(objData.success)
            {
                if(typeof objData.data != "undefined")
                {
                    for(var i = 0; i < objData.data.length; i++)
                    {
                        tableHTML += "<tr>";
                        tableHTML += "<td>";

                        tableHTML += htmlEntities(objData.data[i].email);

                        tableHTML += "</td>";

                        tableHTML += "<td>";

                        if(objData.data[i].firstname == "BP_DOES_NOT_EXIST")
                        {
                            tableHTML += "-";
                        }
                        else
                        {
                            tableHTML += htmlEntities(objData.data[i].firstname) + " " + htmlEntities(objData.data[i].lastname);
                        }

                        tableHTML += "</td>";

                        tableHTML += "<td>";

                        //trash icon is in two places in this code!
                        tableHTML += '<div class="ds-input-container ds-margin-bottom-0 ds-padding-bottom-0 ds-align-text-right">';
                        tableHTML += '    <span class="ds-heading-4 ds-icon-trash-m groupSettingsUsers_delete"></span>';
                        tableHTML += '</div>';

                        tableHTML += "</td>";
                        tableHTML += "</tr>";
                    }
                }


                tableHTML += '</tbody> </table>';

                groupSettingsUserWrapper.html(tableHTML);

                //this is in two places, with different settings
                tableAdminGroupSettingsUsers = $('#groupSettings_users').DataTable( {
                    serverSide: false,
                    "order":
                        [
                            [ 0, "asc" ]
                        ],
                    "bPaginate": false,
                    responsive: true,
                    "bInfo" : true,
                    searching: true,
                    "ordering": true
                } );


                /*$('#groupSettings_users').on('draw.dt', function() {
                    reReady();
                });*/

                $(".addUserToGroup").removeClass("ds-disabled");
                $(".addUserToGroup").prop('disabled', false);

                $(".saveGroupUserSettings").removeClass("ds-disabled");
                $(".saveGroupUserSettings").prop('disabled', false);

                reReady();

            }
            else
            {
                showNotice("error","Error",objData.message);
            }
        });

};


var moduleGroupAdministrationChange = function(e)
{
    var groupSettingsModuleWrapper = $("#groupSettings_modules_wrapper");

    var tableHTML = '<table class="ds-table order-column stripe" id="groupSettings_modules"> <thead> <tr> <th>Name</th><th class="ds-align-text-right">Access</th> </tr> </thead> <tbody>';

    showLoader("Getting group data...");
    $.post( prefixPath+"/API/getGroupPermissions.php", { group_id: $(this).val() } )
        .done(function( data ) {
            hideLoader();
            var objData = JSON.parse(data);
            if(objData.success)
            {
                for (permission in objData.data) {
                    if (objData.data.hasOwnProperty(permission))
                    {
                        tableHTML += "<tr>";
                        tableHTML += "<td>";

                        tableHTML += htmlEntities(permission);

                        tableHTML += "</td>";

                        tableHTML += "<td>";

                        var checkedStr = "";
                        if(objData.data[permission])
                        {
                            checkedStr = "checked";
                        }
                        else
                        {
                            checkedStr = "";
                        }

                        tableHTML += '<div class="ds-input-container ds-margin-bottom-0 ds-padding-bottom-0 ds-align-text-right"> <label for="'+htmlEntities(permission)+'" class="ds-input-toggle"> <input type="checkbox" id="'+htmlEntities(permission)+'" '+checkedStr+'> <div class="ds-input-control"></div> </label> </div>';

                        tableHTML += "</td>";
                        tableHTML += "</tr>";
                    }
                }


                tableHTML += '</tbody> </table>';

                groupSettingsModuleWrapper.html(tableHTML);

                //this is in two places, with different settings
                tableAdminGroupSettingsModules = $('#groupSettings_modules').DataTable( {
                    serverSide: false,
                    "order":
                        [
                            [ 0, "asc" ]
                        ],
                    "bPaginate": false,
                    responsive: true,
                    "bInfo" : true,
                    searching: true,
                    "ordering": true,
                    "columnDefs": [ {
                        "targets": 1,
                        "orderable": false
                    } ]
                } );


                $(".saveGroupModuleSettings").removeClass("ds-disabled");
                $(".saveGroupModuleSettings").prop('disabled', false);

                reReady();

            }
            else
            {
                showNotice("error","Error",objData.message);
            }
        });

};

var groupSettings_idClick = function(e)
{
    e.preventDefault();
    var warningShown = $("input[name=groupSettings_id]").data( "warningShown");
    if(warningShown !== true && $(this).val() != "")
    {
        var continueFunc = function() {
            closeWarning();
            $("input[name=groupSettings_id]").data( "warningShown", true );
        };
        showWarning("Careful! Changing of unique ID for group","<span style='font-weight:bold;'>Are you sure you wish to change unique ID for this group?</span><br/><br/>Following group belongings will be affected:<br/>- users<br/>- permissions<br/>- patterns<br/>- approvals<br/><br/>If you assign the same ID to another group<br/> - group belongings will be transfered to the group you assigned ID to.<br/><br/>If you do not assign this ID to any other group:<br/> - group belongings of this group will be deleted, in case of users, their group will be changed to default group.","2",continueFunc);
    }
};

var deleteNotifPatternClick = function(e)
{
    e.preventDefault();
    $(this).parent().parent().parent().addClass("toBeDeleted"); //mark row as to be deleted

    var rows = tableAdminNotifPatterns
    .rows( '.toBeDeleted' )
    .remove()
    .draw(); //remove the row

    reReady();
};

var deleteUserGroupsPatternClick = function(e)
{
    e.preventDefault();
    $(this).parent().parent().parent().addClass("toBeDeleted"); //mark row as to be deleted

    var rows = tableAdminUserGroupsPatterns
    .rows( '.toBeDeleted' )
    .remove()
    .draw(); //remove the row

    reReady();
};

var deleteUserGroupsAddPatternClick = function(e)
{
    e.preventDefault();
    $(this).parent().parent().parent().addClass("toBeDeleted"); //mark row as to be deleted

    var rows = tableAdminUserGroupsAddPatterns
    .rows( '.toBeDeleted' )
    .remove()
    .draw(); //remove the row

    reReady();
};

var adminEmailSubjectChange = function() {
    if (doNotValidate) return;
    if ($(this).prop('value').trim() === '') {
        addErrorToInput($(this), 'Enter email subject.');
    } else {
        removeErrorFromInput($(this));
    }
};
/*
var adminEmailAddressChange = function() {
    if (doNotValidate) return;
    if ($(this).find(':selected').val() === 'disabled' || $(this).find(':selected').val() === 'undefined') {
        addErrorToInput($(this).parent('.ds-select'), 'Choose one option.');
    } else {
        removeErrorFromInput($(this).parent('.ds-select'));
    }
};
*/
/*
var adminRadioToChange = function() {
    if ($(this).is(':checked')) {
        if ($(this).val() == 'group') {
            radioTo = 'group';
            $('#admin_email_group_address').closest('.ds-select').removeClass('ds-hide');
            $('#admin_email_individual_address').addClass('ds-hide');
        }
        if ($(this).val() == 'individual') {
            radioTo = 'individual';
            $('#admin_email_group_address').closest('.ds-select').addClass('ds-hide');
            $('#admin_email_individual_address').removeClass('ds-hide');
        }
    }
};
*/
var adminEmailContentChange = function() {
    if (doNotValidate) return;
    if ($(this).prop('value').trim() === '') {
        addErrorToInput($(this), 'Enter message.');
    } else {
        removeErrorFromInput($(this));
    }
};
/*
var adminNotifyAddressChange = function() {
    if (doNotValidate) return;
    if ($(this).find(':selected').val() === 'disabled' || $(this).find(':selected').val() === 'undefined') {
        addErrorToInput($(this).parent('.ds-select'), 'Choose one option.');
    } else {
        removeErrorFromInput($(this).parent('.ds-select'));
    }
};
*/
var adminNotifyContentChange = function() {
    if (doNotValidate) return;
    if ($(this).prop('value').trim() === '') {
        addErrorToInput($(this), 'Enter message.');
    } else {
        removeErrorFromInput($(this));
    }
};
/*
var adminNotifyLinkChange = function() {
    if (doNotValidate) return;
    if ($(this).prop('value').trim() === '') {
        addErrorToInput($(this), 'Enter link.');
    } else {
        removeErrorFromInput($(this));
    }
};
*/
var adminEmailSendClick = function()
{
    var errorFound = false;
    var fields = [
            $('#admin_email_subject'),
            $('#admin_email_group_address'),
            $('#admin_email_bcc'),
            $('#admin_email_content')
        ];
    var data = new FormData();

    $.each(fields, function(i)
    {
        var item = this;

        if (i == 2) {
            if (!item[0].validity.valid) errorFound = true;
            else {
                var val = item.prop('value');
                var emails = val.split(',');
                $.each(emails, function() {
                    var email = $.trim(this);
                    if (email !== '') data.append("bcc[]", email);
                });
            }
            /*
             * USE THIS, WHEN WILL FIX THE ISSUE WITH .tags fields in tabs
             *
            if (item.siblings('.tags-input').hasClass('ds-error')) errorFound = true;
            if (item.siblings('.tags-input').children('.tag').length > 0 && item.siblings('.tags-input').hasClass('ds-error')) errorFound = true;
            if (!errorFound && item.siblings('.tags-input').children('.tag').length > 0) {
                $.each(item.siblings('.tags-input').children('.tag'), function() {
                    data.append("bcc[]", $(this).data('tag'));
                });
            }
            */
        } else {
            if (item.prop('required') && (item.prop('value').trim() === '' || item.find(':selected').val() === 'disabled'))
            {
                errorFound = true;
                item.trigger('change');
            } else {
                if (i == 0) data.append("subject", item.prop('value').trim());
                if (i == 1/* && radioTo == 'group'*/) data.append("group", item.find(':selected').val());
                if (i == 3) data.append("message", item.prop('value').trim());
            }
        }
    });

    if (!errorFound) {
        var filesOrig = $("#admin_email_attachment")[0].files;

        $.each(emailAttachments, function(i, file){
            data.append("attachment[]", file);
        });

        showLoader("Sending emails...");

        $.ajax({
            url         : prefixPath+"API/adminSendEmail.php",
            data        : data,
            cache       : false,
            contentType : false,
            processData : false,
            type        : 'POST',
            success     : function(data) {
                var objData = JSON.parse(data);
                if(objData.success)
                {
                    hideLoader();
                    showNotice("success","Done",objData.message,true);

                    doNotValidate = true;
                    $.each(fields, function(i, field) {
                        if (i == 1) {
                            field.children('option[value="disabled"]').prop('selected', true); field.change();
                        } else field.val('');
                    });
                    var fileInput = $(".ds-file-upload");
                    var inputArea = fileInput.closest(".file-area");
                    var listArea = inputArea.siblings(".file-list");
                    var msgArea = inputArea.siblings(".file-msg").children(".ds-file-upload-msg");

                    fileInput.prop('value', '');
                    listArea.empty();
                    msgArea.empty();

                    doNotValidate = false;
                } else {
                    hideLoader();
                    showNotice("error","Error",objData.message);
                }
            },
            error       : function() {
                hideLoader();
                showNotice("error","Error","Sending notifications fails.<br/>Please report this bug to jnyiri@sk.ibm.com.");
            }
        });
    }
};
var adminNotifiSendClick = function()
{
    var errorFound = false;
    var fields = [
            $('#admin_notifi_address'),
            $('#admin_notifi_users'),
            $('#admin_notifi_content'),
            $('#admin_notifi_link')
        ];
    var data = new FormData();

    $.each(fields, function(i)
    {
        var item = this;

        if (i == 1) {
            if (!item[0].validity.valid) errorFound = true;
            else {
                var val = item.prop('value');
                var userEmails = val.split(',');
                $.each(userEmails, function() {
                    var email = $.trim(this);
                    if (email !== '') data.append("bcc[]", email);
                });
            }
            /*
                * USE THIS, WHEN WILL FIX THE ISSUE WITH .tags fields in tabs
                *
            if (item.siblings('.tags-input').hasClass('ds-error')) errorFound = true;
            if (item.siblings('.tags-input').children('.tag').length > 0 && item.siblings('.tags-input').hasClass('ds-error')) errorFound = true;
            if (!errorFound && item.siblings('.tags-input').children('.tag').length > 0) {
                $.each(item.siblings('.tags-input').children('.tag'), function() {
                    data.append("bcc[]", $(this).data('tag'));
                });
            }
            */
        } else {
            if (item.prop('required') && (item.prop('value').trim() === '' || item.find(':selected').val() === 'disabled'))
            {
                errorFound = true;
                item.trigger('change');
            } else {
                if (i == 0) data.append("address", item.find(':selected').val());
                if (i == 2) data.append("message", item.prop('value').trim());
                if (i == 3) data.append("link", item.prop('value').trim());
            }

        }
    });

    if (!errorFound) {
        showLoader("Sending notifications...");
        $.ajax({
            url         : prefixPath+"API/adminSendNotification.php",
            data        : data,
            cache       : false,
            contentType : false,
            processData : false,
            type        : 'POST',
            success     : function(data) {
                var objData = JSON.parse(data);
                if(objData.success)
                {
                    hideLoader();
                    showNotice("success","Done",objData.message,true);

                    doNotValidate = true;
                    $.each(fields, function(i, field) {
                        if (i == 0) {
                            field.children('option[value="disabled"]').prop('selected', true); field.change();
                        } else field.val('');
                    });
                    doNotValidate = false;
                } else {
                    hideLoader();
                    showNotice("error","Error",objData.message);
                }
            },
            error       : function() {
                hideLoader();
                showNotice("error","Error","Sending notifications fails.<br/>Please report this bug to jnyiri@sk.ibm.com.");
            }
        });
    }
};
var deleteButtonDNSListFunction = function(e)
{
    var hostname = $(this).data("hostname");
    var dnsdata = $(this).data("dnsdata");
    var action = $(this).data("action");
    var dnsdata2 = $(this).data("dnsdata2");
    var reverserequired = $(this).data("reverserequired");

    $(".addedDNSList div").each(function(){
        if($(this).hasClass("addedDNSListHostname"))
        {
            var typeDNSDIV = $(this).prev();
            var hostnameDNSDIV = $(this);
            var dataDNSDIV = $(this).next();
            var deleteDNSDIV = dataDNSDIV.next();

            if((hostname == $(this).text() && dataDNSDIV.text() == dnsdata))
            {
                if($("#hostname").val() == "")
                {
                    $("#hostname").val(hostname);
                }
                if($("#dns_data").val() == "")
                {
                    $("#dns_data").val(dnsdata);
                }

                typeDNSDIV.remove();
                hostnameDNSDIV.remove();
                dataDNSDIV.remove();
                deleteDNSDIV.remove();
                delete redirectRequest_addedDNS[(decodeEntities(hostname)+decodeEntities(action)+decodeEntities(dnsdata)+decodeEntities(dnsdata2)+decodeEntities(reverserequired))];
                if($.isEmptyObject(redirectRequest_addedDNS))
                {
                    $(".addedRedirectsTitle").hide();
                }
            }
        }
    });
}

function convertUrlsPartToSomethingElse(toBeConverted,into)
{
    var newArr = {};
    for (key in redirectRequest_addedURLS) {
        if (redirectRequest_addedURLS.hasOwnProperty(key))
        {
            var val = redirectRequest_addedURLS[key];
            var newKey = key.replace(toBeConverted,into);
            var newVal = val;
            newVal.sourceURL = newVal.sourceURL.replace(toBeConverted,into);
            newVal.targetURL = newVal.targetURL.replace(toBeConverted,into);
            newArr[newKey] = newVal;
        }
    }
    redirectRequest_addedURLS = newArr;
    return "Done.";
}

var URTListWindowResize = function(e) {
    var area = false;

    if (addedUrlsList.length === 0) return;

    addedUrlsList.each(function() {
        if ($(this).is(':visible')) {
            area = $(this);
            return true;
        }
    });

    if (!area) {
        return;
    }

    addedUrlsList.each(function(a, currentArea) {
        $.each($('[class*=ds-col-]', currentArea), function() {
            this.style.removeProperty('width');
        });
    });

    if (e || addedUrlsListWidth === 0) {
        var widthFromDOM = area.outerWidth(false);
        if (widthFromDOM > 0) addedUrlsListWidth = widthFromDOM;
    }

    var mobileMode = ( $('.detectColumnWidth:visible').outerWidth(false) === addedUrlsListWidth );
    var typeCol = $('[class*=ds-col-]:nth-child(5n + 1)', addedUrlsList);
    var sourceCol = $('[class*=ds-col-]:nth-child(5n + 2)', addedUrlsList);
    var targetCol = $('[class*=ds-col-]:nth-child(5n + 3)', addedUrlsList);
    var flagCol = $('[class*=ds-col-]:nth-child(5n + 4)', addedUrlsList);
    var actionsCol = $('[class*=ds-col-]:nth-child(5n + 5)', addedUrlsList);

    if (mobileMode) {
        typeCol.attr('data-title', $('[class*=ds-col-]:nth-child(1)', addedUrlsColumnTitles)[0].innerText);
        sourceCol.attr('data-title', $('[class*=ds-col-]:nth-child(2)', addedUrlsColumnTitles)[0].innerText);
        targetCol.each(function() {
            var currentTargetCol = $(this);
            var txt = (currentTargetCol.text().length > 0) ? $('[class*=ds-col-]:nth-child(3)', addedUrlsColumnTitles)[0].innerText : '';
            currentTargetCol.attr('data-title', txt);
        });
        flagCol.each(function() {
            var currentFlagCol = $(this);
            var txt = (currentFlagCol.text().length > 0) ? $('[class*=ds-col-]:nth-child(4)', addedUrlsColumnTitles)[0].innerText : '';
            currentFlagCol.attr('data-title', txt);
        });
        $('[class*=ds-col-]:nth-child(5)', addedUrlsColumnTitles).text('Actions');
        actionsCol.attr('data-title', $('[class*=ds-col-]:nth-child(5)', addedUrlsColumnTitles)[0].innerText);
    } else {
        var typeColW = typeCol[0].offsetWidth;
        if (typeColW === 0) {
            typeColW = (addedUrlsListWidth / 100) * typeCol.outerWidth( true );
            if (typeColW > 40) typeColW = 40;
        }
        var flagColW = flagCol[0].offsetWidth;
        if (flagColW === 0) {
            flagColW = (addedUrlsListWidth / 100) * flagCol.outerWidth( true )
            if (flagColW > 50) flagColW = 50;
        }
        var actionsColW = actionsCol[0].offsetWidth;
        if (actionsColW === 0) {
            actionsColW = (addedUrlsListWidth / 100) * actionsCol.outerWidth( true )
            if (actionsColW > 40) actionsColW = 40;
        }
        var diff = (addedUrlsListWidth - typeColW - flagColW - actionsColW) / 2;

        sourceCol.css('width', diff + 'px');
        targetCol.css('width', diff + 'px');

        $('[class*=ds-col-]:nth-child(1)', addedUrlsColumnTitles).css('width', typeColW + 'px');
        $('[class*=ds-col-]:nth-child(2)', addedUrlsColumnTitles).css('width', diff + 'px');
        $('[class*=ds-col-]:nth-child(3)', addedUrlsColumnTitles).css('width', (diff - flagColW) + 'px');
        $('[class*=ds-col-]:nth-child(4)', addedUrlsColumnTitles).css('width', (flagColW * 2) + 'px');
        $('[class*=ds-col-]:nth-child(5)', addedUrlsColumnTitles).css('width', actionsColW + 'px').text('');
    }
}

var deleteButtonURLListFunction = function(e) {
    e.preventDefault();

    deleteURLList_currentTrashButton = $(this);
    var activeURL = Boolean(Number(deleteURLList_currentTrashButton.data("active")));

    if (activeURL && !deleteURLListType)
    {
        showBlur();
        $('#deleteURLListContainer').show();
    } else {
        if (activeURL)
        {
            if (deleteURLListType === 'notInclude') deletingURLListNotInclude();
            if (deleteURLListType === 'createDeletion') deletingURLListCreateDeletionRule();
        } else {
            deletingURLListNotInclude();
        }

    }
};

var deletingURLListCreateDeletionRule = function() {
    var source_URL = deleteURLList_currentTrashButton.data("source_url");
    var target_URL = deleteURLList_currentTrashButton.data("target_url");
    var oldData = redirectRequest_addedURLS[source_URL+target_URL] || false;

    if (oldData) {
        var newData = oldData;
        var typeIcon = "ds-icon-minus-circle";
        var typeText = "Deletion";

        newData['targetURL'] = '';
        newData['type'] = 'request-type-deletion';

        if(newData.regex === true)
        {
            typeText += "<br/>Regex";
        }
        if(newData.subst === true)
        {
            typeText += "<br/>Substitution";
        }
        if(newData.vanity === true)
        {
            typeText += "<br/>Vanity URL";
        }
        if(newData.isW3 === true)
        {
            typeText += "<br/>Internal";
        }
        if(newData.isIBM === true)
        {
            typeText += "<br/>External";
        }
        if(newData.isOther === true)
        {
            typeText += "<br/>Other";
        }

        var flagURLDIV = deleteURLList_currentTrashButton.prev('.addedUrlsListFlag');
        var targetURLDIV = flagURLDIV.prev();
        var sourceURLDIV = targetURLDIV.prev();
        var typeURLDIV = sourceURLDIV.prev();

        typeURLDIV.remove();
        sourceURLDIV.remove();
        targetURLDIV.remove();
        flagURLDIV.remove();
        deleteURLList_currentTrashButton.remove();

        delete redirectRequest_addedURLS[source_URL+target_URL];

        finalAddURLRedirect(newData,generateTooltipHTML(typeText,typeIcon));
    }

    deleteURLList_currentTrashButton = null;
};

var deletingURLListNotInclude = function() {
    var sourceURL = deleteURLList_currentTrashButton.data("sourceurl");
    var source_URL = deleteURLList_currentTrashButton.data("source_url");
    var target_URL = deleteURLList_currentTrashButton.data("target_url");

    deleteURLList_currentTrashButton = null;

    $(".addedUrlsList div").each(function(){
        if($(this).hasClass("addedUrlsListSource"))
        {
            var typeURLDIV = $(this).prev();
            var sourceURLDIV = $(this);
            var targetURLDIV = $(this).next();
            var flagURLDIV = targetURLDIV.next();
            var deleteURLDIV = flagURLDIV.next();

            if(($(this).prev().text().indexOf("Deletion") != -1 && (source_URL == $(this).text())) || MD5($(this).text()+targetURLDIV.text()) == sourceURL || (source_URL == $(this).text() && targetURLDIV.text() == target_URL))
            {
                var sourceURLNewText = sourceURLDIV.text();
                if(sourceURLNewText.slice(-10))
                {
                    sourceURLNewText = sourceURLNewText.replace("((/?(.*)?)?)","/*");
                }
                if(!targetURLDIV.is("select"))
                {
                    var targetURLNewText = targetURLDIV.text();

                    var re = /(.*)(\$[\d]*)/g;

                    var found = re.exec(targetURLNewText);

                    if(found && found.length === 3 && (found[1]+found[2] == targetURLNewText))
                    {
                        targetURLNewText = targetURLNewText.replace("/"+found[2],"/*");
                    }
                }

                if(($("#source-url").val() == "" || $("#target-url").val() == "" || $("#target-url").val() == "-"))
                {
                    //todo: refactor, find better solution
                    if(typeof flagURLDIV != "undefined" && flagURLDIV.text() != "" && $("#statusCode option[value="+flagURLDIV.text()+"]").length)
                    {
                        $("#statusCode option[value="+flagURLDIV.text()+"]").attr('selected', 'selected');
                        var tmp = '<select id="statusCode">' + $("#statusCode").html() + '</select>';
                        var statusCodeGrandParent = $("#statusCode").parent().parent();
                        statusCodeGrandParent.html("<div class='ds-select'>"+tmp+"</div>");
                        $('#statusCode').select2({dropdownCssClass : 'bigdrop'});
                        updateTargetSourceFields($(tmp));
                    }
                }

                if($("#source-url").val() == "")
                {
                    if(typeURLDIV.text().indexOf("Routing") != -1 || sourceURLNewText.indexOf("//www.ibm.com/link/lookup/") != -1)
                    {
                        $("#source-url").val(sourceURLNewText.replace("//www.ibm.com/link/lookup/","").replace("/link/lookup/",""));
                    }
                    else
                    {
                        $("#source-url").val(sourceURLNewText);
                    }
                }
                if(!targetURLDIV.is("select") && ($("#target-url").val() == "" || $("#target-url").val() == "-"))
                {
                    $("#target-url").val(targetURLNewText);
                }

                sourceUrlChange();

                typeURLDIV.remove();
                sourceURLDIV.remove();
                targetURLDIV.remove();
                flagURLDIV.remove();
                deleteURLDIV.remove();


                delete redirectRequest_addedURLS[(decodeEntities($(this).text())+decodeEntities(targetURLDIV.text()))];
                if($.isEmptyObject(redirectRequest_addedURLS))
                {
                    $(".addedRedirectsTitle").hide();
                }
                processSiteChoiceRadioButtons(false);
            }
            else
            {
                //showNotice("error","Error","Application issue.<br/>Please report this bug to jnyiri@sk.ibm.com.");
            }
        }
    });
}

var notificationButtonClick = function(e) {
    setNotificationCount(0);
    $.post( prefixPath+"API/readNotifications.php",{id:$(this).parent().find("li").data("notification-id")})
        .done(function( data ) {
            var objData = JSON.parse(data);
            if(objData.success)
            {

            }
        });
};

var testRegexOperationsClick = function(e) {
    var testedPattern = $.trim($('#testInput').val());
    var testMethod = $('#testMethod').val();
    var patternsTable = $('#DbPatternsTable').find(':selected').val();

    if (testedPattern == '') return;

    var testResults = $('#testResults');
    testResults.empty();
    showLoader("Testing patterns...");

    $.post( prefixPath+"API/regexOperations.php",{
        method: testMethod,
        pattern: testedPattern,
        table: patternsTable
    })
    .done(function( data ) {
        var objData = JSON.parse(data);
        $('<p><strong>Escape value:</strong> '+objData[0]+'</p>').appendTo(testResults);
        $('<p><strong>Result:</strong></p>').appendTo(testResults);
        if (!objData[1]) $('<p>No match</p>').appendTo(testResults);
        else
        {
            var n = 0;
            $.each(objData[1], function(pattern, status){
                if (status)
                {
                    $('<p>'+pattern+'<span class="ds-offset-1 ds-text-citation ds-text-contextual-green-3">'+objData[2][n]+'</span></p>').appendTo(testResults);
                }
                n++;
            });
        }

        hideLoader();
    });
};

function siteownerInspectorHTMLReportClick() {
    var urls = $('#siteownerinspector_searchurls').val().trim();
    if (!urls.trim()) return;
    var urls = urls.split('\n');

    $('#siteownerinspector_HTMLresults').html('<p class="ds-text-contextual-red-3">Proccessing ...</p>');

    $.getJSON( prefixPath+"/API/getSiteowner.php", { urls: JSON.stringify(urls), output_type: 'html' } )
    .done(function(data) {
        if(data.success)
        {
            $('#siteownerinspector_HTMLresults').html(data.results);
        }
    });
};

function siteownerInspectorExportClick() {
    var urls = $('#siteownerinspector_searchurls').val().trim();
    if (!urls.trim()) return;
    var urls = urls.split('\n');

    $('#siteownerinspector_HTMLresults').html('');
    showLoader("Searching siteowner data in HTML and URT...");

    $.getJSON( prefixPath+"/API/getSiteowner.php", { urls: JSON.stringify(urls), output_type: 'excel' } )
    .done(function(data) {
        var timeStarted = Math.round((new Date()).getTime() / 1000);
        data = JSON.parse(JSON.stringify(data));

        if(data.success === false)
        {
            hideLoader();
            showNotice("error","Error",data.message);
        }
        else if(data.time_left && data.time_left > 0)
        {
            var messageTemplate = data.message;
            $("#loaderText").html(
                data.message
                .replace("%MINUTES%","...")
                .replace("%TIME_STR%","")
                .replace("%DONE_NUM%","0")
                .replace("%TOTAL_NUM%",data.time_left)
                .replace("%PERCENTAGES%","0%")
                );

            clearInterval(taskProgressInterval);
            taskProgressInterval = setInterval(
            function()
            {
                $.getJSON( prefixPath+"/API/getRegexIntersectionTaskProgress.php?id="+data.task_id, function( data2 ) {
                    if(typeof data2.data !== "undefined")
                    {
                        if((data2.data.doneNum === data2.data.notCachedNum) || data2.data.data != "" && typeof data2.data.data !== "undefined")
                        {
                            clearInterval(taskProgressInterval);
                            fileName = "Siteowner Inspector Results ";
                            fileType =  "xlsx";
                            dateInName = 1;
                            window.location = prefixPath+"/API/getExportedExcelResults.php?taskID="+data.task_id+"&fileName="+fileName+"&fileType="+fileType+"&dateInName="+dateInName;
                            hideLoader();
                        }
                        else
                        {
                            var timeNow = Math.round((new Date()).getTime() / 1000);
                            var secondsPassed = timeNow-timeStarted;

                            var timeLeft = ((secondsPassed*data2.data.notCachedNum)/data2.data.doneNum) - secondsPassed;
                            /*if(timeLeft < 60)
                            {
                                $("#loaderText").html(
                                    data.message
                                    .replace("%MINUTES%",Math.ceil(timeLeft))
                                    .replace("%TIME_STR%","second(s)")
                                    .replace("%DONE_NUM%",data2.data.doneNum)
                                    .replace("%TOTAL_NUM%",data2.data.notCachedNum)
                                    .replace("%PERCENTAGES%",Math.floor(data2.data.doneNum/data2.data.notCachedNum*100)+"%")
                                    );
                            }
                            else
                            {
                                $("#loaderText").html(
                                    data.message.replace("%MINUTES%",(Math.ceil(timeLeft/60) != "Infinity" ? Math.ceil(timeLeft/60) : "A few "))
                                    .replace("%TIME_STR%","minute(s)")
                                    .replace("%DONE_NUM%",data2.data.doneNum)
                                    .replace("%TOTAL_NUM%",data2.data.notCachedNum)
                                    .replace("%PERCENTAGES%",Math.floor(data2.data.doneNum/data2.data.notCachedNum*100)+"%")
                                    );
                            }*/
                            $("#loaderText").html("Exporting results...<br/>This might take a while, please wait.");
                        }
                    }
                });
            }, 250);
        }
        else
        {
            fileName = "Siteowner Inspector Results ";
            fileType =  "xlsx";
            dateInName = 1;
            window.location = prefixPath+"/API/getExportedExcelResults.php?taskID="+data.task_id+"&fileName="+fileName+"&fileType="+fileType+"&dateInName="+dateInName;
            hideLoader();
        }
    });
}

function generateTooltipHTML(tooltipText,icon)
{
    return '<div class="ds-tooltip ds-align-text-center"> <span class="'+icon+' ds-icon-button-dark ds-tooltip-trigger" tabindex="-1"></span> <div class="ds-tooltip-content ds-dark" aria-hidden="true">'+tooltipText+'</div></div>';
}

var finalAddURLRedirect = function(URLData,type)
{
    var foundDuplicate = false;
    var isCorrectRealm = true;
    $.each(redirectRequest_addedURLS, function(key, value) {
        if(!(value.isW3 === URLData["isW3"] && value.isOther === URLData["isOther"] && value.isIBM === URLData["isIBM"]))
        {
            isCorrectRealm = false;
        }
        if(value.sourceURL === URLData["sourceURL"])
        {
            foundDuplicate = true;
        }
    });

    if(isCorrectRealm)
    {
        if(typeof redirectRequest_addedURLS[(decodeEntities(URLData["sourceURL"])+decodeEntities(URLData["targetURL"]))] === "undefined" && !foundDuplicate)
        {
            var redirectRequest_addedURLS_Count = Object.keys(redirectRequest_addedURLS).length;
            if((redirectRequest_addedURLS_Count+1) <= maxURLRedirects)
            {
                $(".addedRedirectsTitle").show();
                if(URLData["type"] == "request-type-redirect" || URLData["type"] == "request-type-routing")
                {
                    $(".addedUrlsList").append('<div class="ds-col-1 addedUrlsListType">'+type+'</div><div class="ds-col-4 addedUrlsListSource">'+escapeHtml(URLData["sourceURL"]) +'</div> <div class="ds-col-4 addedUrlsListTarget">'+escapeHtml(URLData["targetURL"])+'</div>'+'<div class="ds-col-2 addedUrlsListFlag">'+(URLData["type"] == "request-type-redirect" ? escapeHtml(URLData["statusCode"]) : '')+'</div>'+'<div class="ds-col-1 addedUrlsListDelete" data-active="'+URLData["isActiveSomewhereElse"]+'" data-source_url="'+escapeHtml(URLData["sourceURL"])+'" data-target_url="'+escapeHtml(URLData["targetURL"])+'" data-sourceurl="'+escapeHtml(MD5(URLData["sourceURL"]+URLData["targetURL"]))+'"><span class="ds-icon-trash-m"></span></div>');
                }
                else
                {
                    $(".addedUrlsList").append('<div class="ds-col-1 addedUrlsListType">'+type+'</div><div class="ds-col-4 addedUrlsListSource">'+escapeHtml(URLData["sourceURL"]) +'</div> <div class="ds-col-4 addedUrlsListTarget"></div> <div class="ds-col-2 addedUrlsListFlag"></div><div class="ds-col-1 addedUrlsListDelete" data-active="'+URLData["isActiveSomewhereElse"]+'" data-source_url="'+escapeHtml(URLData["sourceURL"])+'" data-target_url="'+escapeHtml(URLData["targetURL"])+'" data-sourceurl="'+escapeHtml(MD5(URLData["sourceURL"]+URLData["targetURL"]))+'"><span class="ds-icon-trash-m"></span></div>');
                }
                if($("[name='request-type-choice']:checked").attr("id") !== "request-type-routing" && !$("#target-url").is("select"))
                {
                    $("#target-url").val("");
                }
                $("#source-url").val("");

                if(URLData["type"] == "request-type-deletion" && !$("#target-url").is("select"))
                {
                    URLData["targetURL"] = "";
                    URLData["flag"] = "0";
                }

                redirectRequest_addedURLS[(decodeEntities(URLData["sourceURL"])+decodeEntities(URLData["targetURL"]))] = URLData;
                $(".addedUrlsListDelete").unbind( "click", deleteButtonURLListFunction);
                $(".addedUrlsListDelete").bind( "click", deleteButtonURLListFunction);

                w3ds.init();
            }
            else
            {
                hideLoader();
                showNotice("error","Error","The number of rules in one ticket is limited to 200.");
            }
            redirectRequest_addedURLS_Count = Object.keys(redirectRequest_addedURLS).length;
            $(".ds-heading-3.addedRedirectsTitle").html("Requests [Added: "+(redirectRequest_addedURLS_Count)+", Limit: "+"200"+"]")

            processSiteChoiceRadioButtons(false);

            URTListWindowResize(false);
        }
        else
        {
            hideLoader();
            showNotice("error","Error","Source URL already in the list.");
        }
    }
    else
    {
        hideLoader();
        showNotice("error","Error","Redirect you are adding is from different realm than other redirects.<br/>Please do not mix internal and external redirects in one request.");
    }
};



var finalAddDNS = function(DNSData,type)
{
    $(".addedRedirectsTitle").show();

    $(".addedDNSList").append('<div class="ds-col-1 addedDNSListType">'+type+'</div><div class="ds-col-5 addedDNSListHostname">'+escapeHtml(DNSData["hostname"]) +'</div><div class="ds-col-5 addedDNSListData">'+escapeHtml(DNSData["dnsData"]) +'</div><div class="ds-col-1 addedDNSListDelete" data-hostname="'+escapeHtml(DNSData["hostname"])+'" data-dnsdata="'+escapeHtml(DNSData["dnsData"])+'" data-action="'+escapeHtml(DNSData["action"])+'" data-dnsdata2="'+escapeHtml(DNSData["dnsData2"])+'" data-reverserequired="'+escapeHtml(DNSData["reverseRequired"])+'"><span class="ds-icon-trash-m"></span></div>');


    $("#hostname").val("");
    $("#dns_data").val("");

    redirectRequest_addedDNS[(decodeEntities(DNSData["hostname"])+decodeEntities(DNSData["action"])+decodeEntities(DNSData["dnsData"])+decodeEntities(DNSData["dnsData2"])+decodeEntities(DNSData["reverseRequired"]))] = DNSData;
    $(".addedDNSListDelete").unbind( "click", deleteButtonDNSListFunction);
    $(".addedDNSListDelete").bind( "click", deleteButtonDNSListFunction);

    w3ds.init();
};


//if addingMultipleURLs set to true, return object with post data
function addURL(sourceURL,targetURL,statusCode,subst,regex,type,vanity,addingMultipleURLs,siteChoiceRadio)
{
    addingMultipleURLs = addingMultipleURLs || false;
    var URLData = {};

    URLData.sourceURL = sourceURL;
    URLData.targetURL = targetURL;
    URLData.statusCode = statusCode;
    URLData.subst = subst;
    URLData.regex = regex;
    URLData.type = type;
    URLData.vanity = vanity;

    var typeIcon = "";
    var typeText = "";
    if(URLData.type == "request-type-redirect")
    {
        typeIcon = "ds-icon-export";
        typeText = "Redirect";
    }
    else if(URLData.type == "request-type-naming")
    {
        typeIcon = "ds-icon-plus-circle";
        typeText = "Reservation";
    }
    else if(URLData["type"] == "request-type-routing")
    {
        typeIcon = "ds-icon-link-external";
        typeText = "Routing";
    }
    else
    {
        typeIcon = "ds-icon-minus-circle";
        typeText = "Deletion";
    }

    if(URLData.regex === true)
    {
        typeText += "<br/>Regex";
    }
    if(URLData.subst === true)
    {
        typeText += "<br/>Substitution";
    }
    if(URLData.vanity === true)
    {
        typeText += "<br/>Vanity URL";
    }

    if(siteChoiceRadio === "request-site-w3")
    {
        URLData.isW3 = true;
        URLData.isOther = false;
        URLData.isIBM = false;
        typeText += "<br/>Internal";
    }
    else if(siteChoiceRadio === "request-site-ibm")
    {
        URLData.isW3 = false;
        URLData.isOther = false;
        URLData.isIBM = true;
        typeText += "<br/>External";
    }
    else if(siteChoiceRadio === "request-site-other")
    {
        URLData.isW3 = false;
        URLData.isOther = true;
        URLData.isIBM = false;
        typeText += "<br/>Other";
    }
    else
    {
        URLData.isW3 = false;
        URLData.isOther = false;
        URLData.isIBM = false;
    }

    if(addingMultipleURLs)
    {
        return { addedURLS: JSON.stringify([]), urls: JSON.stringify(URLData) };
    }
    else
    {
        showLoader("Adding URLs...");

        $.post( prefixPath+"/API/generateRedirectURLS.php", { addedURLS: JSON.stringify([]), urls: JSON.stringify(URLData) } )
        .done(function( data ) {
            data = JSON.parse(data);
            var success = true;
            for(var i = 0; i < data.length; i++)
            {
                if(data[i].success === false)
                {
                    success = false;
                }
            }
            data = data[0];
            if(success && data.data)
            {
                var gotData = data.data;
                if(gotData)
                {
                    var continueFunc = function() {
                        finalAddURLRedirect(gotData,generateTooltipHTML(typeText,typeIcon));
                        closeWarning();
                    };
                    hideLoader();
                    if(data.warning && data.message)
                    {
                        showWarning("Warning",data.message,"3",continueFunc);
                    }
                    else
                    {
                        continueFunc();
                    }
                    w3ds.init();
                }
                else
                {
                    hideLoader();
                    showNotice("error","Error","Application issue.<br/>Please report this bug to jnyiri@sk.ibm.com.");
                }
            }
            else
            {
                hideLoader();
                showNotice("error","Error",data.message);
            }
        });
    }
}

function addDNS(hostname,dnsData,dnsData2,reverseRequired,type,action)
{
    var DNSData = {};

    DNSData.hostname = hostname;
    DNSData.dnsData = dnsData;
    DNSData.dnsData2 = dnsData2;
    DNSData.reverseRequired = reverseRequired;
    DNSData.type = type;
    DNSData.action = action;

    var typeIcon = "";
    var typeText = "";
    if(DNSData.action == "request-action-add")
    {
        typeIcon = "ds-icon-plus";
        typeText = "Addition";
    }
    else if(DNSData.action == "request-action-modify")
    {
        typeIcon = "ds-icon-edit";
        typeText = "Modification";
    }
    else if(DNSData.action == "request-action-delete")
    {
        typeIcon = "ds-icon-minus-circle";
        typeText = "Deletion";
    }

    if(DNSData.reverseRequired === true)
    {
        typeText += "<br/>Reverse&nbsp;Required";
    }
    if(DNSData.type == "request-type-a")
    {
        typeText += "<br/> IPv4";
    }
    else if(DNSData.type == "request-type-cname")
    {
        typeText += "<br/> Alias";
    }
    else if(DNSData.type == "request-type-txt")
    {
        typeText += "<br/> Text";
    }
    else if(DNSData.type == "request-type-mx")
    {
        typeText += "<br/> MX&nbsp;Record";
    }

    showLoader("Adding DNS...");

    $.post( prefixPath+"/API/generateDNS.php", { addedDNS: JSON.stringify(redirectRequest_addedDNS), dns: JSON.stringify(DNSData) } )
    .done(function( data ) {
        data = JSON.parse(data);
        var success = true;
        for(var i = 0; i < data.length; i++)
        {
            if(data[i].success === false)
            {
                success = false;
            }
        }

        data = data[0];
        if(success && data.data)
        {
            var gotData = data.data;
            if(gotData)
            {
                var continueFunc = function() {

                    finalAddDNS(gotData,generateTooltipHTML(typeText,typeIcon));
                    closeWarning();
                };
                hideLoader();
                if(data.warning && data.message)
                {
                    showWarning("Warning",data.message,"3",continueFunc);
                }
                else
                {
                    continueFunc();
                }
                w3ds.init();
            }
            else
            {
                hideLoader();
                showNotice("error","Error","Application issue.<br/>Please report this bug to jnyiri@sk.ibm.com.");
            }
        }
        else
        {
            hideLoader();
            showNotice("error","Error",data.message);
        }
    });

}

var redirectRequest_addAnotherDNSButtonClick = function(e) {
    e.preventDefault();
    addDNS(
        $("#hostname").val(),
        $("#dns_data").val(),
        $("#dns_data_2").val(),
        $("#reverseRequired").is(':checked'),
        $("[name='request-type-choice']:checked").attr("id"),
        $("[name='request-action-choice']:checked").attr("id")
        );
};

var redirectRequest_addAnotherURLButtonClick = function(e) {
    e.preventDefault();
    var sourceURL = $("#source-url").val();
    if($("label[for='source-url']").length && $("label[for='source-url']").text().toUpperCase().indexOf("ROUTING") != -1)
    {
        sourceURL = "/link/lookup/" + sourceURL;
    }


    addURL(
        sourceURL,
        $("#target-url").val(),
        $("#statusCode").val(),
        $("#substitution").is(':checked'),
        $("#regex").is(':checked'),
        $("[name='request-type-choice']:checked").attr("id"),
        $("#deploymentpath-investigation").is(':checked'),
        false,
        $("[name='request-site-choice']:checked").attr("id"),
        );
};

var addListOfRedirectsClick = function(e, doNotShowNewLoader) {
    //Todo: subst, regex and other special things
    doNotShowNewLoader = doNotShowNewLoader || false;

    e.preventDefault();
    var splitted = $('#addedUrlsListArea').val().split("\n");
    var partCountOK = true;
    var finalURLS = [];

    var mandatoryFields = 1;
    if($("[name='request-type-choice']:checked").attr("id") == "request-type-naming")
    {
        mandatoryFields = 1;
    }
    else
    {
        mandatoryFields = 3;
    }

    for (var i = 0; i < splitted.length; i++)
    {
        if(splitted[i] !== "")
        {
            var parts = splitted[i].split(/(\s+)/);
            var processedParts = [];
            for (var j = 0; j < parts.length; j++)
            {
                if(parts[j].trim() != "")
                {
                    processedParts.push(parts[j]);
                }
            }
            if(processedParts.length < mandatoryFields)
            {
                partCountOK = false;
            }
            finalURLS.push(processedParts);
        }
    }
    if(partCountOK && finalURLS.length > 0)
    {
        if(doNotShowNewLoader === false)
        {
            showLoader("Adding URLs...");
        }

        var allPostData = [];
        for (i = 0; i < finalURLS.length; i++)
        {
            var subst = false;
            var regex = false;
            var vanity = false;
            if(typeof finalURLS[i][mandatoryFields] !== "undefined")
            {
                subst = (finalURLS[i][mandatoryFields].toLowerCase().indexOf("subst") != -1);
                regex = (finalURLS[i][mandatoryFields].toLowerCase().indexOf("regex") != -1);
                vanity = (finalURLS[i][mandatoryFields].toLowerCase().indexOf("vanity") != -1);
            }
            var source = (typeof finalURLS[i][0] !== "undefined" ? finalURLS[i][0] : "");
            var target = (typeof finalURLS[i][1] !== "undefined" && mandatoryFields == 3 ? finalURLS[i][1] : "");
            var flag = (typeof finalURLS[i][2] !== "undefined" && mandatoryFields == 3 ? finalURLS[i][2] : "");
            allPostData.push(addURL(source,target,flag,subst,regex,$("[name='request-type-choice']:checked").attr("id"),vanity,true,$("[name='request-site-choice']:checked").attr("id")));
        }
        $.post( prefixPath+"/API/generateRedirectURLS.php", { "multiple": allPostData, "isCached": doNotShowNewLoader } )
        .done(function( data ) {
            var timeStarted = Math.round((new Date()).getTime() / 1000);

            var processMultipleGenerateRedirectsData = function(data)
            {
                data = JSON.parse(data);

                if(data.success === false)
                {
                    hideLoader();
                    showNotice("error","Error",data.message);
                }
                else if(data.time_left && data.time_left > 0)
                {
                    var messageTemplate = data.message;
                    $("#loaderText").html(
                        data.message
                        .replace("%MINUTES%","...")
                        .replace("%TIME_STR%","")
                        .replace("%DONE_NUM%","0")
                        .replace("%TOTAL_NUM%","...")
                        .replace("%PERCENTAGES%","0%")
                        );

                    var messageTemplate = data.message;
                    $("#loaderText").html(
                        data.message
                        .replace("%MINUTES%","...")
                        .replace("%TIME_STR%","")
                        .replace("%DONE_NUM%","0")
                        .replace("%TOTAL_NUM%","...")
                        .replace("%PERCENTAGES%","0%")
                        );

                    clearInterval(taskProgressInterval);
                    taskProgressInterval = setInterval(
                    function()
                    {
                        $.getJSON( prefixPath+"/API/getRegexIntersectionTaskProgress.php?id="+data.task_id, function( data2 ) {
                            if(typeof data2.data !== "undefined")
                            {
                                if((data2.data.doneNum === data2.data.notCachedNum) || data2.data.data != "" && typeof data2.data.data !== "undefined")
                                {
                                    clearInterval(taskProgressInterval);
                                    $("#loaderText").html("Please wait...");
                                    setTimeout(function()
                                    {
                                        processMultipleGenerateRedirectsData(data2.data.data);
                                    }, 500);

                                }
                                else
                                {
                                    var timeNow = Math.round((new Date()).getTime() / 1000);
                                    var secondsPassed = timeNow-timeStarted;

                                    var timeLeft = ((secondsPassed*data2.data.notCachedNum)/data2.data.doneNum) - secondsPassed;
                                    if(timeLeft < 60)
                                    {
                                        $("#loaderText").html(
                                            data.message
                                            .replace("%MINUTES%",Math.ceil(timeLeft))
                                            .replace("%TIME_STR%","second(s)")
                                            .replace("%DONE_NUM%",data2.data.doneNum)
                                            .replace("%TOTAL_NUM%",data2.data.notCachedNum)
                                            .replace("%PERCENTAGES%",Math.floor(data2.data.doneNum/data2.data.notCachedNum*100)+"%")
                                            );
                                    }
                                    else
                                    {
                                        $("#loaderText").html(
                                            data.message.replace("%MINUTES%",Math.ceil(timeLeft/60))
                                            .replace("%TIME_STR%","minute(s)")
                                            .replace("%DONE_NUM%",data2.data.doneNum)
                                            .replace("%TOTAL_NUM%",data2.data.notCachedNum)
                                            .replace("%PERCENTAGES%",Math.floor(data2.data.doneNum/data2.data.notCachedNum*100)+"%")
                                            );
                                    }
                                }
                            }

                        });
                    }, 5000);
                }
                else
                {
                    var success = true;
                    var warnings = [];
                    for(var i = 0; i < data.length; i++)
                    {
                        if(data[i].success === false)
                        {
                            success = false;
                            data.message = data[i].message;
                        }
                        if(data[i].warning === true)
                        {
                            if(warnings.indexOf(data[i].message) == -1)
                            {
                                warnings.push(data[i].message);
                            }
                        }
                    }
                    var typeTexts = [];
                    var typeIcons = [];

                    var processed = false;
                    var processedData = [];

                    for(i = 0; i < data.length; i++)
                    {
                        if(success && data[i].data)
                        {
                            var gotData = data[i].data;
                            if(gotData)
                            {
                                var typeIcon = "";
                                var typeText = "";
                                if(gotData.type == "request-type-redirect")
                                {
                                    typeIcon = "ds-icon-export";
                                    typeText = "Redirect";
                                }
                                else if(gotData.type == "request-type-naming")
                                {
                                    typeIcon = "ds-icon-plus-circle";
                                    typeText = "Reservation";
                                }
                                else if(gotData["type"] == "request-type-routing")
                                {
                                    typeIcon = "ds-icon-link-external";
                                    typeText = "Routing";
                                }
                                else
                                {
                                    typeIcon = "ds-icon-minus-circle";
                                    typeText = "Deletion";
                                }

                                if(gotData.regex === true)
                                {
                                    typeText += "<br/>Regex";
                                }
                                if(gotData.subst === true)
                                {
                                    typeText += "<br/>Substitution";
                                }
                                if(gotData.vanity === true)
                                {
                                    typeText += "<br/>Vanity URL";
                                }
                                if(gotData.isW3 === true)
                                {
                                    typeText += "<br/>Internal";
                                }
                                if(gotData.isIBM === true)
                                {
                                    typeText += "<br/>External";
                                }
                                if(gotData.isOther === true)
                                {
                                    typeText += "<br/>Other";
                                }
                                typeTexts.push(typeText);
                                typeIcons.push(typeIcon);

                                processed = true;
                                processedData.push(gotData);
                            }
                            else
                            {
                                processed = false;
                                hideLoader();
                                showNotice("error","Error","Application issue.<br/>Please report this bug to jnyiri@sk.ibm.com.");
                                break;
                            }
                        }
                        else
                        {
                            processed = false;
                            hideLoader();
                            showNotice("error","Error",data.message);
                            break;
                        }
                    }

                    if(processed)
                    {
                        hideLoader();
                        var continueFunc = function(warningsLeft)
                        {
                            if(warningsLeft.length === 0)
                            {
                                for(var i = 0; i < processedData.length; i++)
                                {
                                    finalAddURLRedirect(processedData[i],generateTooltipHTML(typeTexts[i],typeIcons[i]));
                                }

                                closeWarning();
                                $("#addedUrlsListArea").val("");
                                w3ds.init();
                            }
                            else
                            {
                                showWarning("Warning",warningsLeft[0],"3",function(){
                                    warningsLeft.shift();
                                    continueFunc(warningsLeft);
                                });
                            }
                        };
                        continueFunc(warnings);
                    }
                }
            }
            processMultipleGenerateRedirectsData(data);
        });

    }
    else
    {
        showNotice("error","Error","Sent format of URLs is invalid or no URLs sent.");
    }


};

var alertCloseButtonClick = function(e) {
    e.preventDefault();
    closeNotice();
};

var popUpCancelButtonClick = function(e) {
    e.preventDefault();
    closePopUp();
};

var warningCancelButtonClick = function(e) {
    e.preventDefault();
    closeWarning();
};

var warningSubmitButtonClick = function(e) {
    e.preventDefault();
    closeWarning();
};

var userUbiChoiceClick = function(e) {
    processUBIRadioButtons();
};

var requestChoiceClick = function(e) {
    processRequestChoiceRadioButtons();
};

var requestSiteClick = function(e) {
    processSiteChoiceRadioButtons(e);
};

var requestActionChoiceClick = function(e) {
    processRequestChoiceRadioButtons();
}

var popUpInnerClick = function(e) {
    e.stopPropagation();
};

var deleteURLListNotIncludeButtonClick = function(e) {
    deletingURLListNotInclude();
    if ($('#deletingURLListRemember').is(':checked')) {
        deleteURLListType = 'notInclude';
        $('.deleteURLListTypeNotif .notifyText').text('Forget my decision about removal action (remove from ticket).');
        $('.deleteURLListTypeNotif').show();
    }
    closeOverlay(e, $('#deleteURLListContainer'));
};

var deleteURLListCreateDeletionRuleButtonClick = function(e) {
    deletingURLListCreateDeletionRule();
    if ($('#deletingURLListRemember').is(':checked')) {
        deleteURLListType = 'createDeletion';
        $('.deleteURLListTypeNotif .notifyText').text('Forget my decision about removal action (deactivate redirect).');
        $('.deleteURLListTypeNotif').show();
    }
    closeOverlay(e, $('#deleteURLListContainer'));
};

var deleteURLListTypeNotifClick = function(e) {
    $('.deleteURLListTypeNotif').hide(function() {
        $('#deletingURLListRemember').prop('checked', false);
        deleteURLListType = false;
        $('.deleteURLListTypeNotif .notifyText').text('');
    });
};

var newCommentClick = function(e) {
    e.preventDefault();
    var customHTML = '<div class="ds-input-container ds-margin-bottom-1 ds-padding-bottom-0 ds-margin-bottom-0"><div class="ds-select"><select id="predefinedMessagesInCommentPopUp"><option disabled selected>Choose predefined comment</option></select></div></div>';

    showPopUp("Add comment","Enter your comment","newComment", false, customHTML);

    $("#popUpCustomContent").hide();
    $.post( prefixPath+"/API/getGroupPredefinedMessages.php", {})
    .done(function( data ) {
        var objData = JSON.parse(data);
        if(objData.success)
        {
            if(objData.data.length > 0)
            {
                $.each(objData.data, function (i, item) {
                    $('#predefinedMessagesInCommentPopUp').append($('<option>', {
                        value: htmlEntities(item.message),
                        text : item.title
                    }));
                });
                $('select').select2({dropdownCssClass : 'bigdrop'});
                $("#popUpCustomContent").show();
                $("#predefinedMessagesInCommentPopUp").unbind( "change", predefinedMessagesInCommentPopUpChange);
                $("#predefinedMessagesInCommentPopUp").bind( "change", predefinedMessagesInCommentPopUpChange);

            }
            else
            {
                $("#popUpCustomContent").hide();
            }
        }
    });

};

var approveRedirectClick = function(e) {
    e.preventDefault();
    asGroup = $(this).data("asgroup");
    if(typeof asGroup == "undefined")
    {
        asGroup = false;
    }
    var expirationDateAllowed = ($("#allow-expiration-date").is(':checked') ? "1" : "0");

    var continueFunc = function() {
        closeWarning();
        var customHTML = '<div class="ds-input-container ds-margin-bottom-1 ds-padding-bottom-0 ds-margin-bottom-0"><div class="ds-select"><select id="predefinedMessagesInCommentPopUp"><option disabled selected>Choose predefined comment</option></select></div></div>';

        showPopUp("Approve Redirect","Enter your comment","approveRedirect", false, customHTML);

        $("#popUpCustomContent").hide();
        $.post( prefixPath+"/API/getGroupPredefinedMessages.php", {})
        .done(function( data ) {
            var objData = JSON.parse(data);
            if(objData.success)
            {
                if(objData.data.length > 0)
                {
                    $.each(objData.data, function (i, item) {
                        $('#predefinedMessagesInCommentPopUp').append($('<option>', {
                            value: htmlEntities(item.message),
                            text : item.title
                        }));
                    });
                    $('select').select2({dropdownCssClass : 'bigdrop'});
                    $("#popUpCustomContent").show();
                    $("#predefinedMessagesInCommentPopUp").unbind( "change", predefinedMessagesInCommentPopUpChange);
                    $("#predefinedMessagesInCommentPopUp").bind( "change", predefinedMessagesInCommentPopUpChange);

                }
                else
                {
                    $("#popUpCustomContent").hide();
                }
            }
        });
    };

    if(expirationDateAllowed === "1")
    {
        continueFunc();
    }
    else
    {

        showWarning("Expiration date missing","Are you sure you wish to approve this request without expiration date?<br/>Please note, that all vanity URLS have to have expiration date and for a period maximum of 1 year.","2",continueFunc);
    }
};

var cancelRedirectClick = function(e) {
    e.preventDefault();
    var customHTML = '<div class="ds-input-container ds-margin-bottom-1 ds-padding-bottom-0 ds-margin-bottom-0"><div class="ds-select"><select id="predefinedMessagesInCommentPopUp"><option disabled selected>Choose predefined comment</option></select></div></div>';

    showPopUp("Cancel Redirect","Enter your comment","cancelRedirect",false,customHTML);

    $("#popUpCustomContent").hide();
    $.post( prefixPath+"/API/getGroupPredefinedMessages.php", {})
    .done(function( data ) {
        var objData = JSON.parse(data);
        if(objData.success)
        {
            if(objData.data.length > 0)
            {
                $.each(objData.data, function (i, item) {
                    $('#predefinedMessagesInCommentPopUp').append($('<option>', {
                        value: htmlEntities(item.message),
                        text : item.title
                    }));
                });
                $('select').select2({dropdownCssClass : 'bigdrop'});
                $("#popUpCustomContent").show();
                $("#predefinedMessagesInCommentPopUp").unbind( "change", predefinedMessagesInCommentPopUpChange);
                $("#predefinedMessagesInCommentPopUp").bind( "change", predefinedMessagesInCommentPopUpChange);

            }
            else
            {
                $("#popUpCustomContent").hide();
            }
        }
    });
};

var submitRedirectStatusDatesClick = function(e) {
    e.preventDefault();

    $.getJSON( prefixPath+"/API/getMetrics.php", { id: 3, dateFrom: $("#dateFrom").val(), dateTo: $("#dateTo").val() } )
    .done(function( data ) {
        if(data.success)
        {

            var dataTable = new google.visualization.DataTable(data.data);
            var specialChartOptions =
            {
                "width": "100%",
                "height": 500,
                "is3D": true,
                'chartArea': {'width': '100%', 'height': '80%'},
                "backgroundColor": '#F3F3F3',
                "sliceVisibilityThreshold": 0,
                pieSliceText: 'value',
                legend: {
                    position: 'labeled',
                    labeledValueText: 'both',
                    textStyle: {
                        color: '#02587F',
                        fontSize: 14
                    }
                }
            };
            chart3 = new google.visualization.PieChart($("#chartID3")[0]);
            chart3.draw(dataTable, specialChartOptions);

        }
    });

    $.getJSON( prefixPath+"/API/getMetrics.php", { id: 8, dateFrom: $("#dateFrom").val(), dateTo: $("#dateTo").val() } )
    .done(function( data ) {
        if(data.success)
        {
            var gridLinesCount = parseInt(Math.round(Math.max(data.data.rows[0].c[1].v, data.data.rows[1].c[1].v) / 15));

            if (gridLinesCount % 2 !== 0) gridLinesCount--;
            if (gridLinesCount < 4) gridLinesCount = 4;

            var dataTable = new google.visualization.DataTable(data.data);
            var specialChartOptions =
            {
                "width": "100%",
                "height": 500,
                'chartArea': {'width': '80%', 'height': '60%'},
                "backgroundColor": '#F3F3F3',
                vAxis: {
                    minValue: 0
                },
                annotations: {
                    alwaysOutside: true
                },
                legend: {
                    position: 'none'
                }
            };
            chart8 = new google.visualization.ColumnChart($("#chartID8")[0]);
            chart8.draw(dataTable, specialChartOptions);
        }
    });
};

var submitRedirectGroupedByStatusDatesClick = function(e) {
    e.preventDefault();

    $.getJSON( prefixPath+"/API/getMetrics.php", { id: 3, dateFrom: $("#chart3dateFrom").val(), dateTo: $("#chart3dateTo").val() } )
    .done(function( data ) {
        if(data.success)
        {
            var dataTable = new google.visualization.DataTable(data.data);
            var specialChartOptions =
            {
                "width": "100%",
                "height": 500,
                "is3D": true,
                'chartArea': {'width': '100%', 'height': '80%'},
                "backgroundColor": '#F3F3F3',
                "sliceVisibilityThreshold": 0,
                pieSliceText: 'value',
                legend: {
                    position: 'labeled',
                    labeledValueText: 'both',
                    textStyle: {
                        color: '#02587F',
                        fontSize: 14
                    }
                }
            };
            chart3 = new google.visualization.PieChart($("#chartID3")[0]);
            chart3.draw(dataTable, specialChartOptions);
        }
    });
};

var instaActivateRedirectClick = function(e) {
    e.preventDefault();


    var expirationDateAllowed = ($("#allow-expiration-date").is(':checked') ? "1" : "0");

    var continueFunc = function() {
        closeWarning();
        showPopUp("Instantly Activate Redirect",'Are you sure?\nThis will skip any further approvals from other teams OR earliest activation time and instantly approve AND ACTIVATE redirect.\nWrite "[yes]" to continue, you can also include comment _after_ it.',"instaActivateRedirect");
    };

    if(expirationDateAllowed === "1")
    {
        continueFunc();
    }
    else
    {
        showWarning("Expiration date missing","Are you sure you wish to approve this request without expiration date?<br/>Please note, that all vanity URLS have to have expiration date and for a period maximum of 1 year.","2",continueFunc);
    }

};

var feedbackButtonClick = function(e) {
    e.preventDefault();
    showPopUp("Send Feedback","Enter your comment or question","submitFeedback");
};

var editRequestClick = function(e) {
    var requestStatus = $("#status_container").find(".activeStatus").find("p").text();
    if(requestStatus == "Pending")
    {
        showNotice("error","Error","You are not able to edit Pending request.<br/>If you need to edit, please cancel or reject this request, you will be able to edit after that.");
    }
    else
    {
        window.location.href = prefixPath +"request/"+getRequestCode()+"/edit";
    }
};

var rejectRedirectClick = function(e) {
    e.preventDefault();
    asGroup = $(this).data("asgroup");
    if(typeof asGroup == "undefined")
    {
        asGroup = false;
    }
    var customHTML = '<div class="ds-input-container ds-margin-bottom-1 ds-padding-bottom-0 ds-margin-bottom-0"><div class="ds-select"><select id="predefinedMessagesInCommentPopUp"><option disabled selected>Choose predefined comment</option></select></div></div>';

    showPopUp("Reject Redirect","Enter your comment","rejectRedirect",false,customHTML);

    $("#popUpCustomContent").hide();
    $.post( prefixPath+"/API/getGroupPredefinedMessages.php", {})
    .done(function( data ) {
        var objData = JSON.parse(data);
        if(objData.success)
        {
            if(objData.data.length > 0)
            {
                $.each(objData.data, function (i, item) {
                    $('#predefinedMessagesInCommentPopUp').append($('<option>', {
                        value: htmlEntities(item.message),
                        text : item.title
                    }));
                });
                $('select').select2({dropdownCssClass : 'bigdrop'});
                $("#popUpCustomContent").show();
                $("#predefinedMessagesInCommentPopUp").unbind( "change", predefinedMessagesInCommentPopUpChange);
                $("#predefinedMessagesInCommentPopUp").bind( "change", predefinedMessagesInCommentPopUpChange);

            }
            else
            {
                $("#popUpCustomContent").hide();
            }
        }
    });
};

var getRequestID = function()
{
    return global_Request_ID;
};

var getRequestCode = function()
{
    return global_Request_Code;
};

var popUpSubmitButtonClick = function(e) {
    e.preventDefault();
    closePopUp();

    var popUpElem = $("#popUpContainer");
    var popUpTextArea = popUpElem.find("#popUpTextArea");

    var submittingText = "Submitting...";
    var successText = "Submitted";
    var okToContinue = true;
    var successFunction = function()
    {
        window.location.href = prefixPath +"request/"+getRequestCode();
    };
    var url = false;
    var postData = {
        requestID:getRequestID()
    };
    switch(popUpType) {
        case "newComment":
            submittingText = "Submitting comment...";
            url = prefixPath+"API/addCommentToRedirectRequest.php";
            postData.text = popUpTextArea.val();
            successText = "Comment added";
            successFunction = function()
            {
                var afterRefresh = function() {
                    removeBlur();
                    closePopUp();
                    closeNotice();
                    $("#popUpTextArea").val("");
                };
                refreshRedirect(getRequestID(),afterRefresh);

            };
            break;
        case "approveRedirect":
            submittingText = "Approving request...";
            url = prefixPath+"API/processRedirect.php";
            postData.text = popUpTextArea.val();
            postData.action = "approve";
            postData.asGroup = asGroup;
            successText = "Request approved";
            successFunction = function()
            {
                var afterRefresh = function() {
                    removeBlur();
                    closePopUp();
                    closeNotice();
                    $("#popUpTextArea").val("");
                };
                refreshRedirect(getRequestID(),afterRefresh);
            };
            break;
        case "addUserToGroup":
            if(typeof popUpCallBackFunction == "function")
            {
                popUpCallBackFunction(popUpTextArea.val());
                popUpTextArea.val("");
            }
            okToContinue = false;
            break;
        case "rejectRedirect":
            submittingText = "Rejecting request...";
            url = prefixPath+"API/processRedirect.php";
            postData.text = popUpTextArea.val();
            postData.action = "reject";
            postData.asGroup = asGroup;
            successText = "Request rejected";
            successFunction = function()
            {
                var afterRefresh = function() {
                    removeBlur();
                    closePopUp();
                    closeNotice();
                    $("#popUpTextArea").val("");
                };
                refreshRedirect(getRequestID(),afterRefresh);
            };
            if(postData.text == "")
            {
                okToContinue = false;
                showNotice("error","Error","Write rejection reason.");
            }
            break;
        case "cancelRedirect":
            submittingText = "Canceling request...";
            url = prefixPath+"API/cancelRedirect.php";
            postData.text = popUpTextArea.val();
            postData.action = "cancel";
            successText = "Redirect canceled";
            successFunction = function()
            {
                var afterRefresh = function() {
                    removeBlur();
                    closePopUp();
                    closeNotice();
                    $("#popUpTextArea").val("");
                };
                refreshRedirect(getRequestID(),afterRefresh);
            };
            break;
        case "instaActivateRedirect":
            submittingText = "Approving and activating request...";
            url = prefixPath+"API/processRedirect.php";

            var postText = popUpTextArea.val().trim();
            var hasApprovalInText = (postText.toLowerCase().substr(0,5) === "[yes]");
            postText = postText.substr(5).trim();

            postData.text = postText;
            postData.action = "instaActivate";
            successText = "Request approved and activated";
            successFunction = function()
            {
                var afterRefresh = function() {
                    removeBlur();
                    closePopUp();
                    closeNotice();
                    $("#popUpTextArea").val("");
                };
                refreshRedirect(getRequestID(),afterRefresh);
            };
            if(hasApprovalInText === false)
            {
                okToContinue = false;
                showNotice("error","Error","You have not confirmed the action.");
            }
            break;
        case "submitFeedback":
            submittingText = "Sending feedback...";
            url = prefixPath+"API/sendFeedback.php";
            postData.text = popUpTextArea.val();
            postData.action = "sendFeedback";
            successText = "Feedback sent";
            successFunction = function()
            {
                removeBlur();
                closePopUp();
                closeNotice();
                $("#popUpTextArea").val("");
            };
            if(postData.text == "")
            {
                okToContinue = false;
                showNotice("error","Error","Write feedback text.");
            }
            break;
    }
    if(okToContinue)
    {
        if(url)
        {
            showLoader(submittingText);
            $.post(url, postData)
                .done(function( data ) {
                    var objData = JSON.parse(data);
                    var timeoutLength = objData.message.length*10*5;
                    if(timeoutLength < 500) timeoutLength = 500;
                    setTimeout(function() //timeout so that user thinks something is actually happening because it is too fast
                        {
                            hideLoader();
                            var objData = JSON.parse(data);
                            if(objData.success)
                            {
                                showNotice("success",successText,objData.message,false);
                                var submittedData = objData.data;
                                setTimeout(successFunction, timeoutLength);
                            }
                            else
                            {
                                showNotice("error","Error",objData.message);
                            }
                        },
                        500);
                });
        }
        else
        {
            showNotice("error","Error","Something went wrong.");
        }
    }
};

var popUpContainerClick = function(e) {
    e.preventDefault();
    closePopUp();
};

var DNSRequest_submitButtonClick = function(e) {
    e.preventDefault();

    var dnsRequestData = {};

    dnsRequestData['dns-domain'] = $("#dns-domain").val();
    dnsRequestData['dns-arbo'] = $("#dns-arbo").val();
    dnsRequestData['dns-type'] = $("#dns-type").val();
    dnsRequestData['dns-description'] = $("#dns-description").val();
    dnsRequestData['cmad-er'] = $("#cmad-er").val();
    dnsRequestData['dns-geo'] = $("#dns-geo").val();
    dnsRequestData['request-name'] = $("#request-name").val();
    dnsRequestData['requests'] = getDNSData();


    dnsRequestData = JSON.stringify(dnsRequestData);


    var continueFunc = function()
    {
        $.post( prefixPath+"API/addDNSRequest.php", {data: dnsRequestData})
        .done(function( data ) {
            hideLoader();
            var objData = JSON.parse(data);
            if(objData.success)
            {
                showNotice("success","Request submitted",objData.message,false);
                var submittedData = objData.data;
                setTimeout(function(){
                    window.location = prefixPath +"request/"+submittedData.requestCode;
                }, 2500);
            }
            else
            {
                showNotice("error","Error",objData.message);
                $("input").change(); //to verify all inputs
                $("textarea").change(); //to verify all textareas
            }
        });
    }
    continueFunc();
}

var redirectRequest_submitButtonClick = function(e) {

    e.preventDefault();

    var continueFunc = function()
    {
        closeWarning();
        var tagsData = getTagsData();

        tagsData.addRevToID = getRequestID();

        tagsData["imap-number"] = $("#imap-number").val();
        tagsData["site-description"] = $("#site-description").val();
        tagsData["earliest-processing-date"] = $("#earliest-processing-date").val();
        tagsData["earliest-processing-time"] = $("#earliest-processing-time").val();
        tagsData["allow-expiration-date"] = ($("#allow-expiration-date").is(':checked') ? "1" : "0");
        tagsData["allow-activation-date"] = ($("#allow-activation-date").is(':checked') ? "1" : "0");
        tagsData["expiration-date"] = $("#expiration-date").val();
        tagsData["expiration-time"] = $("#expiration-time").val();
        tagsData["cmad-er"] = $("#cmad-er").val();
        tagsData["trademark-investigation"] = ($("#trademark-investigation").is(':checked') ? "1" : "0");
        tagsData.comments = $("#comments").val();
        tagsData.urls = getURLsData();
        tagsData.name = $("#request-name").val();

        tagsData["user-ubi-choice-has-number"] = ($("#user-ubi-choice-has-number").val() ? $("#user-ubi-choice-has-number").val() : false);
        tagsData["user-ubi-choice-create-project-name"] = $("#user-ubi-choice-create-project-name").val();
        tagsData["user-ubi-choice-create-billing-major"] = $("#user-ubi-choice-create-billing-major").val();
        tagsData["user-ubi-choice-create-billing-minor"] = $("#user-ubi-choice-create-billing-minor").val();
        tagsData["user-ubi-choice-create-billing-dept"] = $("#user-ubi-choice-create-billing-dept").val();
        tagsData["user-ubi-choice-create-billing-accountid"] = $("#user-ubi-choice-create-billing-accountid").val();
        tagsData["user-ubi-choice-create-billing-div"] = $("#user-ubi-choice-create-billing-div").val();
        tagsData["user-ubi-choice-create-billing-location"] = $("#user-ubi-choice-create-billing-location").val();
        tagsData["user-ubi-choice-create-business-unit"] = $("#user-ubi-choice-create-business-unit").val();

        tagsData["optional-approvals"] = {};
        $("[id*=additionalApprovalGroup-]").each(function(){
            if($(this).is(":checked"))
            {
                var groupID = $(this).data("group");
                var selectForThisGroup = $("#additionalApprovalGroup-"+groupID+"-contactPerson");
                if(selectForThisGroup.length)
                {
                    tagsData["optional-approvals"][groupID] = selectForThisGroup.val();
                }
                else
                {
                    tagsData["optional-approvals"][groupID] = 0;
                }
            }
        });


        var userUbiChoice = $("[name='user-ubi-choice']:checked");


        switch (userUbiChoice.attr("id")) {
            case "user-has-ubi":
                tagsData.userUBIchoice = "is";
                break;
            case "user-create-ubi":
                tagsData.userUBIchoice = "create";
                break;
            case "user-exemption-ubi":
                tagsData.userUBIchoice = "exemption";
        }

        if(tagsData.userUBIchoice == "exemption")
        {
            tagsData["user-ubi-choice-has-number"] = $("#user-ubi-choice-has-exemption").val();
        }

        showLoader("Submitting request...");


        tagsData = JSON.stringify(tagsData);


        $.post( prefixPath+"API/addRedirectRequest.php", {data: tagsData})
        .done(function( data ) {

            var objData = JSON.parse(data);
            if(objData.success)
            {
                /*
                showNotice("success","Request submitted",objData.message,false);
                var submittedData = objData.data;
                setTimeout(function(){
                    window.location = prefixPath +"request/"+submittedData.requestCode;
                }, 2500);
                */
                var timeStarted = Math.round((new Date()).getTime() / 1000);

                clearInterval(taskProgressInterval);
                taskProgressInterval = setInterval(
                function()
                {
                    $.getJSON( prefixPath+"/API/getRegexIntersectionTaskProgress.php?id="+objData.task_id, function( data2 ) {
                        if(typeof data2.data !== "undefined")
                        {
                            if((data2.data.doneNum === data2.data.notCachedNum) || data2.data.data != "" && typeof data2.data.data !== "undefined")
                            {
                                $("#loaderText").html("Please wait...");

                                var returnedData = JSON.parse(data2.data.data);
                                if(typeof returnedData.success === "undefined")
                                {
                                    $("#loaderText").html(returnedData);
                                }
                                else
                                {
                                    hideLoader();
                                    clearInterval(taskProgressInterval);
                                    if(returnedData.success === false)
                                    {
                                        showNotice("error","Error",returnedData.message);
                                    }
                                    else
                                    {
                                        showNotice("success","Request submitted",returnedData.message,false);
                                        var submittedData = returnedData.data;
                                        setTimeout(function(){
                                            window.location = prefixPath +"request/"+submittedData.requestCode;
                                        }, 2500);
                                    }

                                }

                            }
                            else
                            {
                                var timeNow = Math.round((new Date()).getTime() / 1000);
                                var secondsPassed = timeNow-timeStarted;

                                var timeLeft = ((secondsPassed*data2.data.notCachedNum)/data2.data.doneNum) - secondsPassed;
                                if(timeLeft < 60)
                                {
                                    $("#loaderText").html(
                                        objData.message
                                        .replace("%MINUTES%",Math.ceil(timeLeft))
                                        .replace("%TIME_STR%","second(s)")
                                        .replace("%DONE_NUM%",data2.data.doneNum)
                                        .replace("%TOTAL_NUM%",data2.data.notCachedNum)
                                        .replace("%PERCENTAGES%",Math.floor(data2.data.doneNum/data2.data.notCachedNum*100)+"%")
                                        );
                                }
                                else
                                {
                                    $("#loaderText").html(
                                        objData.message.replace("%MINUTES%",Math.ceil(timeLeft/60))
                                        .replace("%TIME_STR%","minute(s)")
                                        .replace("%DONE_NUM%",data2.data.doneNum)
                                        .replace("%TOTAL_NUM%",data2.data.notCachedNum)
                                        .replace("%PERCENTAGES%",Math.floor(data2.data.doneNum/data2.data.notCachedNum*100)+"%")
                                        );
                                }
                            }
                        }
                    });
                }, 2000);
            }
            else
            {
                hideLoader();
                showNotice("error","Error",objData.message);
                $("input").change(); //to verify all inputs
                $("textarea").change(); //to verify all textareas
            }
        });
    };
    var continueFunc2 = function()
    {
        var expirationDateAllowed = ($("#allow-expiration-date").is(':checked') ? "1" : "0");
        var tagsData = getTagsData();
        var isOnlyDeletion = true;
        var allURLs = getURLsData();
        //look for any URL that is not deletion
        for (var obj in allURLs) {
            if (allURLs.hasOwnProperty(obj)) {
                if(allURLs[obj].type !== "request-type-deletion")
                {
                    isOnlyDeletion = false;
                }
            }
        }
        if(expirationDateAllowed === "0" && isOnlyDeletion === false && $("#expiration-date").length > 0)
        {
            showWarning("Expiration date missing","Are you sure you wish to submit this request without expiration date?<br/>Please note, that all vanity URLS have to have expiration date and for a period maximum of 1 year.","1",continueFunc);
        }
        else
        {
            continueFunc();
        }
    };

    var sourceAndTargetEmpty = ($("#source-url").val() == "" && $("#target-url").val() == "");
    if(sourceAndTargetEmpty || $("#target-url").is("select"))
    {
        continueFunc2();
    }
    else
    {
        showWarning("Source or Target URL fields are not empty","You have put something into source or target url fields and have not added into list of URLs.<br/>Are you sure you wish to continue?","1",continueFunc2);
    }

};

var predefinedMessagesInCommentPopUpChange = function(e)
{
    e.preventDefault();
    if($("#popUpTextArea").val() == "")
    {
        $("#popUpTextArea").val(decodeEntities($(this).val()));
    }
    else
    {
        $("#popUpTextArea").val($("#popUpTextArea").val()+"\n"+decodeEntities($(this).val()));
    }
}

var lastTabSelected = "tab-control-all";
function runSearch(doSearch)
{
    var namingOnly;
    var redirectsOnly;
    var routingsOnly;
    var useRegexSearch;
    var returnOnlyActiveURLs;
    var tabSelectedID;

    $("#filtersForRecords").find("input").attr("disabled",true);
    $("#filtersForRecords").find("input").addClass("ds-disabled");
    $("#filtersForRecords").find("select").attr("disabled",true);
    $("#filtersForRecords").find("select").addClass("ds-disabled");
    $("#filtersForRecords").find("button").attr("disabled",true);
    $("#filtersForRecords").find("button").addClass("ds-disabled");
    showLoader("Searching records...");

    if(doSearch === undefined)
    {
        doSearch = true;
    }
    if($('button[id^="tab-control"].ds-selected').length)
    {
        tabSelectedID = $('button[id^="tab-control"].ds-selected').attr("id");
    }

    if($("#namingOnly").length)
    {
        namingOnly = $("#namingOnly").is(":checked");
    }
    else
    {
        namingOnly = true;
    }

    if($("#redirectOnly").length)
    {
        redirectsOnly = $("#redirectOnly").is(":checked");
    }
    else
    {
        redirectsOnly = true;
    }

    if($("#routingOnly").length)
    {
        routingsOnly = $("#routingOnly").is(":checked");
    }
    else
    {
        routingsOnly = true;
    }

    if($("#useRegexSearch").length)
    {
        useRegexSearch = $("#useRegexSearch").is(":checked");
    }
    else
    {
        useRegexSearch = false;
    }

    if($("#returnOnlyActiveURLs").length)
    {
        returnOnlyActiveURLs = $("#returnOnlyActiveURLs").is(":checked");
    }
    else
    {
        returnOnlyActiveURLs = false;
    }

    var sourceURLFilter = $("#filterSourceURL").val();
    var targetURLFilter = $("#filterTargetURL").val();
    var submitterFilter = $("#filterSubmitter").val();
    var submitDateFilter_from = $("#filterSubmitDate_from").val();
    var submitDateFilter_to = $("#filterSubmitDate_to").val();
    var expirationDateFilter_from = $("#filterExpirationDate_from").val();
    var expirationDateFilter_to = $("#filterExpirationDate_to").val();
    var statusFilter = $("#filterStatus").val();
    var siteOwnerFilter = $("#filterSiteOwner").val();
    var recordNameFilter = $("#filterRecordName").val();
    var notificationListFilter = $("#filterNotificationList").val();
    var actionRequiredFrom = $("#actionRequiredFrom").val();
    var searchInput = $("#searchInput");

    if(lastTabSelected !== tabSelectedID)
    {
        switch(tabSelectedID) {
            case "tab-control-required":
                savedSearchString = genFilterString(savedSearchString,"myRequests",true);
                savedSearchString = genFilterString(savedSearchString,"actionRequired",false);
                searchInput.val("");
                break;
            case "tab-control-myrequests":
                savedSearchString = genFilterString(savedSearchString,"actionRequired",true);
                savedSearchString = genFilterString(savedSearchString,"myRequests",false);
                searchInput.val("");
                break;
            default:
                savedSearchString = genFilterString(savedSearchString,"myRequests",true);
                savedSearchString = genFilterString(savedSearchString,"actionRequired",true);
                searchInput.val("");
                break;
        }
        lastTabSelected = tabSelectedID;
    }

    savedSearchString = genFilterString(savedSearchString,"useRegexSearch",!useRegexSearch);
    savedSearchString = genFilterString(savedSearchString,"returnOnlyActiveURLs",!returnOnlyActiveURLs);
    savedSearchString = genFilterString(savedSearchString,"no-namings",namingOnly);
    savedSearchString = genFilterString(savedSearchString,"no-redirects",redirectsOnly);
    savedSearchString = genFilterString(savedSearchString,"no-routings",routingsOnly);

    if(sourceURLFilter != "")
    {
        savedSearchString = genFilterString(savedSearchString,"sourceURL",false,sourceURLFilter);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"sourceURL",true);
    }

    if(targetURLFilter != "")
    {
        savedSearchString = genFilterString(savedSearchString,"targetURL",false,targetURLFilter);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"targetURL",true);
    }

    if(submitterFilter != "")
    {
        savedSearchString = genFilterString(savedSearchString,"submitter",false,submitterFilter);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"submitter",true);
    }

    if(submitDateFilter_from != "")
    {
        savedSearchString = genFilterString(savedSearchString,"submitDateFrom",false,submitDateFilter_from);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"submitDateFrom",true);
    }

    if(submitDateFilter_to != "")
    {
        savedSearchString = genFilterString(savedSearchString,"submitDateTo",false,submitDateFilter_to);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"submitDateTo",true);
    }

    if(expirationDateFilter_from != "")
    {
        savedSearchString = genFilterString(savedSearchString,"expirationDateFrom",false,expirationDateFilter_from);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"expirationDateFrom",true);
    }
    if(expirationDateFilter_to != "")
    {
        savedSearchString = genFilterString(savedSearchString,"expirationDateTo",false,expirationDateFilter_to);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"expirationDateTo",true);
    }

    if(statusFilter != "" && statusFilter != null)
    {
        savedSearchString = genFilterString(savedSearchString,"status",false,statusFilter);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"status",true);
    }

    if(siteOwnerFilter != "")
    {
        savedSearchString = genFilterString(savedSearchString,"siteOwner",false,siteOwnerFilter);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"siteOwner",true);
    }
    if(recordNameFilter != "")
    {
        savedSearchString = genFilterString(savedSearchString,"recordName",false,recordNameFilter);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"recordName",true);
    }

    if(notificationListFilter != "")
    {
        savedSearchString = genFilterString(savedSearchString,"notificationList",false,notificationListFilter);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString,"notificationList",true);
    }
    if(actionRequiredFrom != "" && actionRequiredFrom != null)
    {
        savedSearchString = genFilterString(savedSearchString, "actionRequiredFrom", false, actionRequiredFrom);
    }
    else
    {
        savedSearchString = genFilterString(savedSearchString, "actionRequiredFrom", true);
    }

    var searchInputVal = searchInput.val();
    if(doSearch)
    {
        var finalSearchString = searchInputVal+"-2mt0fH6qC93w2k6p-"+savedSearchString;
        recordsTable.search(finalSearchString).draw();
    }
    searchInput.val(searchInputVal);

    return savedSearchString;
}

var updateTargetSourceFields = function(_this) {
    var requestTypeChoice = $("[name='request-type-choice']:checked");
    if($(_this).val() >Â 299 && $(_this).val() < 400)
    {
        $("#target-url").attr("disabled",false);
        $("#target-url").removeClass("ds-disabled");

    }
    else if($(_this).val() >Â 399 && $(_this).val() < 500 && requestTypeChoice.attr("id") !== "request-type-routing")
    {
        $("#target-url").val("-");
        $("#target-url").attr("disabled",true);
        $("#target-url").addClass("ds-disabled");
    }
}

var switchFilteringClick = function(e) {
    runSearch();
};

var switchAdminTabClick = function(e) {
    reReady();
};

var filtersForRecordsClick = function(e) {
    if(e.which == 13)
    {
        runSearch();
    }
};

var applyFiltersClick = function(e) {
    runSearch();
};

var exportRecordsSearchResultsClick = function(e) {
    e.preventDefault();

    if (exportSearchRecords['records_filtered'] >= 3000)
        showWarning(
            'Warning',
            "You are going to generate excel file with a lot of data. This might take a long time (few minutes). Are you sure you wish to continue?",
            "6",
            function() {
                closeWarning();
                exportRecordsSearchResultsProccessing();
            }
        );
    else exportRecordsSearchResultsProccessing();
};
var exportRecordsSearchResultsProccessing = function() {
    showLoader("Generating search report...");

    $.post( prefixPath+"/API/exportRecordsSearchResults.php",{search:  exportSearchRecords['search_string']})
    .done(function( data ) {
        var timeStarted = Math.round((new Date()).getTime() / 1000);
        data = JSON.parse(data);

        if(data.success === false)
        {
            hideLoader();
            showNotice("error","Error",data.message);
        }
        else if(data.time_left && data.time_left > 0)
        {
            var messageTemplate = data.message;
            $("#loaderText").html(
                data.message
                .replace("%MINUTES%","...")
                .replace("%TIME_STR%","")
                .replace("%DONE_NUM%","0")
                .replace("%TOTAL_NUM%","...")
                .replace("%PERCENTAGES%","0%")
                );

            clearInterval(taskProgressInterval);
            taskProgressInterval = setInterval(
            function()
            {
                $.getJSON( prefixPath+"/API/getRegexIntersectionTaskProgress.php?id="+data.task_id, function( data2 ) {
                    if(typeof data2.data !== "undefined")
                    {
                        if((data2.data.doneNum === data2.data.notCachedNum) || data2.data.data != "" && typeof data2.data.data !== "undefined")
                        {
                            clearInterval(taskProgressInterval);
                            fileName = "Records Search Results ";
                            fileType =  "xlsx";
                            dateInName = 1;
                            window.location = prefixPath+"/API/getExportedExcelResults.php?taskID="+data.task_id+"&fileName="+fileName+"&fileType="+fileType+"&dateInName="+dateInName;
                            hideLoader();
                        }
                        else
                        {
                            var timeNow = Math.round((new Date()).getTime() / 1000);
                            var secondsPassed = timeNow-timeStarted;

                            var timeLeft = ((secondsPassed*data2.data.notCachedNum)/data2.data.doneNum) - secondsPassed;
                            if(timeLeft < 60)
                            {
                                $("#loaderText").html(
                                    data.message
                                    .replace("%MINUTES%",Math.ceil(timeLeft))
                                    .replace("%TIME_STR%","second(s)")
                                    .replace("%DONE_NUM%",data2.data.doneNum)
                                    .replace("%TOTAL_NUM%",data2.data.notCachedNum)
                                    .replace("%PERCENTAGES%",Math.floor(data2.data.doneNum/data2.data.notCachedNum*100)+"%")
                                    );
                            }
                            else
                            {
                                $("#loaderText").html(
                                    data.message.replace("%MINUTES%",Math.ceil(timeLeft/60))
                                    .replace("%TIME_STR%","minute(s)")
                                    .replace("%DONE_NUM%",data2.data.doneNum)
                                    .replace("%TOTAL_NUM%",data2.data.notCachedNum)
                                    .replace("%PERCENTAGES%",Math.floor(data2.data.doneNum/data2.data.notCachedNum*100)+"%")
                                    );
                            }
                        }
                    }
                });
            }, 1000);
        }
        else
        {
            fileName = "Records Search Results ";
            fileType =  "xlsx";
            dateInName = 1;
            window.location = prefixPath+"/API/getExportedExcelResults.php?taskID="+data.task_id+"&fileName="+fileName+"&fileType="+fileType+"&dateInName="+dateInName;
            hideLoader();
        }
    });
}
var cancelFiltersClick = function(e) {
    $("#filtersForRecords").find("input").val('');
    $("#filtersForRecords").find("select").val('disabled');
    runSearch();
};

var decodeEntities = (function() {
  // this prevents any overhead from creating the object each time
  var element = document.createElement('div');

  function decodeHTMLEntities (str) {
    if(str && typeof str === 'string') {
      // strip script/html tags
      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
      element.innerHTML = str;
      str = element.textContent;
      element.textContent = '';
    }

    return str;
  }

  return decodeHTMLEntities;
})();

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var refreshStatusInAdminFunc = function()
{

    $.getJSON( prefixPath+"/API/getStatusMessagesTable.php" )
    .done(function(response) {
        tableAdminStatusLog.clear( );
        for (var k = 0; k < response.data.length; k++){
            tableAdminStatusLog.row.add(response.data[k]);
        }
        tableAdminStatusLog.draw();

        $.each($('#statusLogTable .status-type'), function() {
            var cell = $(this);
            var row = cell.parent('tr');
            var css = '';

            switch(cell.text())
            {
                case "DEBUG":
                    css = "ds-text-neutral-warm-3";
                    break;
                case "ERROR":
                    css = "ds-text-contextual-red-3";
                    break;
                case "TEST":
                    css = "ds-text-contextual-red-3";
                    break;
                case "WARNING":
                    css = "ds-text-contextual-yellow-5";
                    break;
            }

            if (css !== '') $('td', row).addClass(css);
        });

        $.each($('#statusLogTable td'), function() {
            if (!$(this).hasClass('ds-text-small'))
                $(this).addClass('ds-text-small ds-padding-top-1 ds-padding-bottom-1');
        });
    });
};

var timeRefreshingTimer = false;

function reReady()
{
    if($('#adminTabs').find($('button[id^="tab-control"].ds-selected')).length)
    {
        tabAdminSelectedID = $('#adminTabs').find($('button[id^="tab-control"].ds-selected')).attr("id");
    }

    if(tabAdminSelectedID == "tab-control-updates")
    {
        refreshStatusInAdminFunc();
        tableAdminStatusLog_interval = setInterval(refreshStatusInAdminFunc, 3000);
    }
    else
    {
        clearInterval(tableAdminStatusLog_interval);
    }

    tableForURLsInRequest = $('#tableForURLsInRequest').DataTable( {
        serverSide: false,
        "order":
        [
            [ 1, "asc" ]
        ],
        "bPaginate": false,
        responsive: true,
        "bInfo" : false,
        searching: false
    } );

    $('select').select2({dropdownCssClass : 'bigdrop'}); //needs to be first

    $("[id*=additionalApprovalGroup-]").change(function(){
        var groupID = $(this).data("group");
        if(typeof groupID !== "undefined")
        {
            if($(this).is(":checked"))
            {
                $("#additionalApprovalGroup-"+groupID+"-contactPerson").parent().parent().show();
            }
            else
            {
                $("#additionalApprovalGroup-"+groupID+"-contactPerson").parent().parent().hide();
            }
        }
    });
    $("[id*=additionalApprovalGroup-]").trigger('change');

    if(typeof google != 'undefined' && typeof google.charts != 'undefined')
    {
        google.charts.load("current", {"packages":["corechart"]});
        if($("#chartID1").length)
        {
            google.charts.setOnLoadCallback(function() {
                $.getJSON( prefixPath+"/API/getMetrics.php", { id: 1 } )
                .done(function( data ) {
                    if(data.success)
                    {
                        var dataTable = new google.visualization.DataTable(data.data);

                        chart1 = new google.visualization.PieChart($("#chartID1")[0]);
                        chart1.draw(dataTable, chartOptions);
                    }
                });
            });
        }
        if($("#chartID3").length)
        {
            google.charts.setOnLoadCallback(function(){
                $.getJSON( prefixPath+"/API/getMetrics.php", { id: 3, dateFrom: $("#dateFrom").val(), dateTo: $("#dateTo").val() } )
                .done(function( data ) {
                    if(data.success)
                    {

                        var dataTable = new google.visualization.DataTable(data.data);
                        var specialChartOptions =
                        {
                            "width": "100%",
                            "height": 500,
                            "is3D": true,
                            'chartArea': {'width': '100%', 'height': '80%'},
                            "backgroundColor": '#F3F3F3',
                            "sliceVisibilityThreshold": 0,
                            pieSliceText: 'value',
                            legend: {
                                position: 'labeled',
                                labeledValueText: 'both',
                                textStyle: {
                                    color: '#02587F',
                                    fontSize: 14
                                }
                            }
                        };
                        chart3 = new google.visualization.PieChart($("#chartID3")[0]);
                        chart3.draw(dataTable, specialChartOptions);
                    }
                });
            });
        }
        if($("#chartID4").length)
        {
            google.charts.setOnLoadCallback(function() {
                $.getJSON( prefixPath+"/API/getMetrics.php", { id: 4 } )
                .done(function( data ) {
                    if(data.success)
                    {
                        var dataTable = new google.visualization.DataTable(data.data);

                        chart1 = new google.visualization.BarChart($("#chartID4")[0]);

                        var specialChartOptions =
                        {
                             "width": "100%",
                            "height": 200,
                            "is3D": true,
                            'chartArea': {'width': '100%', 'height': '80%'},
                            "backgroundColor": '#FDFDFD',
                            "sliceVisibilityThreshold": 0,
                            series: {
                              0: {
                                type: 'bars',
                                visibleInLegend: false
                              },
                              1: {
                                type: 'line',
                                color: 'grey',
                                lineWidth: 0,
                                pointSize: 0,
                                visibleInLegend: false
                              }
                            },
                            colors: ['orange']
                        };
                        chart1.draw(dataTable, specialChartOptions);
                    }
                });
            });
        }
        if($("#chartID5").length)
        {
            google.charts.setOnLoadCallback(function() {
                $.getJSON( prefixPath+"/API/getMetrics.php", { id: 5 } )
                .done(function( data ) {
                    if(data.success)
                    {
                        var dataTable = new google.visualization.DataTable(data.data);

                        chart1 = new google.visualization.BarChart($("#chartID5")[0]);

                        var specialChartOptions =
                        {
                             "width": "100%",
                            "height": 200,
                            "is3D": true,
                            'chartArea': {'width': '100%', 'height': '80%'},
                            "backgroundColor": '#FDFDFD',
                            "sliceVisibilityThreshold": 0,
                            vAxis:
                            {
                                "minValue":0
                            },
                            hAxis: {
                                direction: -1,
                            },
                            series: {
                              0: {
                                type: 'bars',
                                visibleInLegend: false
                              },
                              1: {
                                type: 'line',
                                color: 'grey',
                                lineWidth: 0,
                                pointSize: 0,
                                visibleInLegend: false
                              }
                            },
                        };
                        chart1.draw(dataTable, specialChartOptions);
                    }
                });
            });
        }
        if($("#chartID6").length)
        {
            google.charts.setOnLoadCallback(function() {
                $.getJSON( prefixPath+"/API/getMetrics.php", { id: 6 } )
                .done(function( data ) {
                    if(data.success)
                    {
                        var dataTable = new google.visualization.DataTable(data.data);

                        chart1 = new google.visualization.LineChart($("#chartID6")[0]);

                        var specialChartOptions =
                        {
                            "width": "100%",
                            "height": 300,
                            'chartArea': {'width': '80%', 'height': '60%'},
                            "backgroundColor": '#FDFDFD',
                            curveType: 'function',
                            legend: { position: 'bottom' }
                        };
                        chart1.draw(dataTable, specialChartOptions);
                    }
                });
            });
        }
        if($("#chartID7").length)
        {
            google.charts.setOnLoadCallback(function() {
                $.getJSON( prefixPath+"/API/getMetrics.php", { id: 7 } )
                .done(function( data ) {
                    if(data.success)
                    {
                        var dataTable = new google.visualization.DataTable(data.data);

                        chart1 = new google.visualization.ColumnChart($("#chartID7")[0]);

                        var specialChartOptions =
                        {
                            "width": "100%",
                            "height": 300,
                            'chartArea': {'width': '80%', 'height': '60%'},
                            "backgroundColor": '#FDFDFD',
                            curveType: 'function',
                            legend:
                            {
                                position: 'bottom'
                            }
                        };
                        chart1.draw(dataTable, specialChartOptions);
                    }
                });
            });
        }
        if($("#chartID8").length)
        {
            google.charts.setOnLoadCallback(function(){
                $.getJSON( prefixPath+"/API/getMetrics.php", { id: 8, dateFrom: $("#dateFrom").val(), dateTo: $("#dateTo").val() } )
                .done(function( data ) {
                    if(data.success)
                    {
                        var dataTable = new google.visualization.DataTable(data.data);
                        var specialChartOptions =
                        {
                            "width": "100%",
                            "height": 500,
                            'chartArea': {'width': '80%', 'height': '60%'},
                            "backgroundColor": '#F3F3F3',
                            vAxis: {
                                minValue: 0
                            },
                            annotations: {
                                alwaysOutside: true
                            },
                            legend: {
                                position: 'none'
                            }
                        };
                        chart8 = new google.visualization.ColumnChart($("#chartID8")[0]);
                        chart8.draw(dataTable, specialChartOptions);
                    }
                });
            });
        }
    }


    if($("#recordsTable_wrapper").length)
    {
        runSearch();
    }

    if($(".ds-file-upload").length)
    {
        $.each($(".ds-file-upload"), function() {
            var fileInput = $(this);
            var inputArea = fileInput.closest(".file-area");
            var listArea = inputArea.siblings(".file-list");
            var isAttachments = false;

            if ($("#tab-content-email").length == 1)
            {
                emailAttachments = [];
                isAttachments = true;
            }

            fileInput.closest(".file-area").siblings(".file-msg").after('<div class="ds-col-xs-12 file-list"></div>');

            fileInput.on("change", function(e) {
                e.preventDefault();

                if (!isAttachments) {
                    checkFileList(fileInput);
                    return;
                }

                var files = fileInput.prop("files");
                var list = '';

                // save basic data  - SUPPORT NOW ONLY FOR EMAIL ATTACHMENTS
                $.each(files, function(i, file) {
                    // check for dual files
                    var foundInArray = emailAttachments.filter(function (obj) {
                            return obj.name == file.name;
                        });

                    if (foundInArray.length > 0) return true;

                    emailAttachments.push(file);
                });

                checkFileList(fileInput, emailAttachments);

                $.each(emailAttachments, function(i, file) {
                    list += '<div data-name="' + file.name + '" class="ds-file-name">' + this.name;
                    list += ' <span class="ds-heading-4 ds-icon-close-circle';
                    list += '"></span></div>';
                });
                listArea.html(list);

                $('.ds-icon-close-circle', listArea).on("click", function() {
                    var name = $(this).parent(".ds-file-name").data("name");

                    emailAttachments = $.grep(emailAttachments, function(e) {
                        return e.name != name;
                    });

                    $(this).parent(".ds-file-name").remove();

                    checkFileList(fileInput, emailAttachments);
                });
            });
        });
    }

    $(".regexLink").unbind("click",regexLinkClick);
    $(".regexLink").bind("click",regexLinkClick);

    $("#predefinedMessagesInCommentPopUp").unbind( "change", predefinedMessagesInCommentPopUpChange);
    $("#predefinedMessagesInCommentPopUp").bind( "change", predefinedMessagesInCommentPopUpChange);

    $("#userGroupAdministration").unbind( "change", userGroupAdministrationChange);
    $("#userGroupAdministration").bind( "change", userGroupAdministrationChange);

    $("#predefinedGroupMessagesAdministration").unbind( "change", predefinedGroupMessagesAdministrationChange);
    $("#predefinedGroupMessagesAdministration").bind( "change", predefinedGroupMessagesAdministrationChange);

    $("#dns-domain").unbind( "keyup", dnsDomainChange);
    $("#dns-domain").bind( "keyup", dnsDomainChange);

    $("#exportRecordsSearchResults").unbind( "click", exportRecordsSearchResultsClick);
    $("#exportRecordsSearchResults").bind( "click", exportRecordsSearchResultsClick);


    $("#source-url").unbind( "keyup", sourceUrlChange);
    $("#source-url").bind( "keyup", sourceUrlChange);

    $("#target-url").unbind( "keyup", targetUrlChange);
    $("#target-url").bind( "keyup", targetUrlChange);


    $("#groupSettings_modules input[type='checkbox']").unbind( "change", groupSettings_modulesChange);
    $("#groupSettings_modules input[type='checkbox']").bind( "change", groupSettings_modulesChange);

    $("#moduleGroupAdministration").unbind( "change", moduleGroupAdministrationChange);
    $("#moduleGroupAdministration").bind( "change", moduleGroupAdministrationChange);

    $("input[name=groupSettings_id]").unbind( "click", groupSettings_idClick);
    $("input[name=groupSettings_id]").bind( "click", groupSettings_idClick);

    $(".groupSettingsUsers_delete").unbind( "click", deleteGroupUserClick);
    $(".groupSettingsUsers_delete").bind( "click", deleteGroupUserClick);

    $("span[name=groupSettings_delete]").unbind( "click", deleteGroupClick);
    $("span[name=groupSettings_delete]").bind( "click", deleteGroupClick);

    $("span[name=blockPattern_delete]").unbind( "click", deleteBlockPatternClick);
    $("span[name=blockPattern_delete]").bind( "click", deleteBlockPatternClick);

    $("span[name=messages_delete]").unbind( "click", messagesDeleteClick);
    $("span[name=messages_delete]").bind( "click", messagesDeleteClick);

    $("span[name=notifPattern_delete]").unbind( "click", deleteNotifPatternClick);
    $("span[name=notifPattern_delete]").bind( "click", deleteNotifPatternClick);

    $("span[name=userGroupsPattern_delete]").unbind( "click", deleteUserGroupsPatternClick);
    $("span[name=userGroupsPattern_delete]").bind( "click", deleteUserGroupsPatternClick);

    $("span[name=userGroupsAddPattern_delete]").unbind( "click", deleteUserGroupsAddPatternClick);
    $("span[name=userGroupsAddPattern_delete]").bind( "click", deleteUserGroupsAddPatternClick);

    $(".copyContent").unbind( "click", copyContentClick);
    $(".copyContent").bind( "click", copyContentClick);

    $(".addBlockPattern").unbind( "click", addBlockPatternClick);
    $(".addBlockPattern").bind( "click", addBlockPatternClick);

    $(".addGroup").unbind( "click", addGroupClick);
    $(".addGroup").bind( "click", addGroupClick);

    $(".addPredefinedMessage").unbind( "click", addPredefinedMessageClick);
    $(".addPredefinedMessage").bind( "click", addPredefinedMessageClick);

    $(".addNotifPattern").unbind( "click", addNotifPatternClick);
    $(".addNotifPattern").bind( "click", addNotifPatternClick);

    $(".addUserGroupsPattern").unbind( "click", addUserGroupsPatternClick);
    $(".addUserGroupsPattern").bind( "click", addUserGroupsPatternClick);

    $(".addUserGroupsAddPattern").unbind( "click", addUserGroupsPatternAddClick);
    $(".addUserGroupsAddPattern").bind( "click", addUserGroupsPatternAddClick);

    $(".saveBlockPattern").unbind( "click", saveBlockPatternClick);
    $(".saveBlockPattern").bind( "click", saveBlockPatternClick);

    $(".saveGroupSettings").unbind( "click", saveGroupSettingsClick);
    $(".saveGroupSettings").bind( "click", saveGroupSettingsClick);

    $(".saveGroupUserSettings").unbind( "click", saveGroupUserSettingsClick);
    $(".saveGroupUserSettings").bind( "click", saveGroupUserSettingsClick);

    $(".savePredefinedMessages").unbind( "click", savePredefinedMessagesClick);
    $(".savePredefinedMessages").bind( "click", savePredefinedMessagesClick);

    $(".saveGroupModuleSettings").unbind( "click", saveGroupModuleSettingsClick);
    $(".saveGroupModuleSettings").bind( "click", saveGroupModuleSettingsClick);

    $(".saveNotifPattern").unbind( "click", saveNotifPatternClick);
    $(".saveNotifPattern").bind( "click", saveNotifPatternClick);

    $(".saveUserGroupsPattern").unbind( "click", saveUserGroupsPatternClick);
    $(".saveUserGroupsPattern").bind( "click", saveUserGroupsPatternClick);

    $(".saveUserGroupsAddPattern").unbind( "click", saveUserGroupsAddPatternClick);
    $(".saveUserGroupsAddPattern").bind( "click", saveUserGroupsAddPatternClick);

    $(".cancelBlockPattern").unbind( "click", cancelBlockPatternClick);
    $(".cancelBlockPattern").bind( "click", cancelBlockPatternClick);

    $(".cancelGroupSettings").unbind( "click", cancelGroupSettingsClick);
    $(".cancelGroupSettings").bind( "click", cancelGroupSettingsClick);

    $(".cancelGroupSettingsUser").unbind( "click", cancelGroupSettingsClick);
    $(".cancelGroupSettingsUser").bind( "click", cancelGroupSettingsClick);

    $(".cancelGroupSettingsModule").unbind( "click", cancelGroupSettingsClick);
    $(".cancelGroupSettingsModule").bind( "click", cancelGroupSettingsClick);

    $(".addUserToGroup").unbind( "click", addUserToGroupClick);
    $(".addUserToGroup").bind( "click", addUserToGroupClick);

    $(".cancelNotifPattern").unbind( "click", cancelNotifPatternClick);
    $(".cancelNotifPattern").bind( "click", cancelNotifPatternClick);

    $(".cancelUserGroupsPattern").unbind( "click", cancelUserGroupsPatternClick);
    $(".cancelUserGroupsPattern").bind( "click", cancelUserGroupsPatternClick);

    $(".cancelUserGroupsAddPattern").unbind( "click", cancelUserGroupsAddPatternClick);
    $(".cancelUserGroupsAddPattern").bind( "click", cancelUserGroupsAddPatternClick);

    $("#sourceURLVerify").unbind( "click", sourceURLVerifyClick);
    $("#sourceURLVerify").bind( "click", sourceURLVerifyClick);

    $("#filtersForRecords").find("input").unbind("keypress", filtersForRecordsClick);
    $("#filtersForRecords").find("input").bind("keypress", filtersForRecordsClick);

    $("#searchTabsContainer").find('button[id^="tab-control"]').unbind( "click", switchFilteringClick);
    $("#searchTabsContainer").find('button[id^="tab-control"]').bind( "click", switchFilteringClick);

    $("#adminTabs").find('button[id^="tab-control"]').unbind( "click", switchAdminTabClick);
    $("#adminTabs").find('button[id^="tab-control"]').bind( "click", switchAdminTabClick);

    $(window).unbind( "resize", URTListWindowResize);
    $(window).bind( "resize", URTListWindowResize);

    $(".addedUrlsListDelete").unbind( "click", deleteButtonURLListFunction);
    $(".addedUrlsListDelete").bind( "click", deleteButtonURLListFunction);

    $(".addedDNSListDelete").unbind( "click", deleteButtonDNSListFunction);
    $(".addedDNSListDelete").bind( "click", deleteButtonDNSListFunction);

    $("#notification-button").unbind( "click", notificationButtonClick);
    $("#notification-button").bind( "click", notificationButtonClick);

    $("#redirectRequest_addAnotherURLButton").unbind( "click", redirectRequest_addAnotherURLButtonClick);
    $("#redirectRequest_addAnotherURLButton").bind( "click", redirectRequest_addAnotherURLButtonClick);

    $("#redirectRequest_addAnotherDNSButton").unbind( "click", redirectRequest_addAnotherDNSButtonClick);
    $("#redirectRequest_addAnotherDNSButton").bind( "click", redirectRequest_addAnotherDNSButtonClick);

    $("#alertCloseButton").unbind( "click", alertCloseButtonClick);
    $("#alertCloseButton").bind( "click", alertCloseButtonClick);

    $("#popUpCancelButton").unbind( "click", popUpCancelButtonClick);
    $("#popUpCancelButton").bind( "click", popUpCancelButtonClick);

    $("#warningCancelButton").unbind( "click", warningCancelButtonClick);
    $("#warningCancelButton").bind( "click", warningCancelButtonClick);

    $("#warningSubmitButton").unbind( "click", warningSubmitButtonClick);
    $("#warningSubmitButton").bind( "click", warningSubmitButtonClick);

    $("#deleteURLList_createDeletionRuleButton").unbind( "click", deleteURLListCreateDeletionRuleButtonClick);
    $("#deleteURLList_createDeletionRuleButton").bind( "click", deleteURLListCreateDeletionRuleButtonClick);

    $("#deleteURLList_notIncludeButton").unbind( "click", deleteURLListNotIncludeButtonClick);
    $("#deleteURLList_notIncludeButton").bind( "click", deleteURLListNotIncludeButtonClick);

    $(".deleteURLListTypeNotif").unbind( "click", deleteURLListTypeNotifClick);
    $(".deleteURLListTypeNotif").bind( "click", deleteURLListTypeNotifClick);

    $("[name='request-type-choice']").unbind( "click", requestChoiceClick);
    $("[name='request-type-choice']").bind( "click", requestChoiceClick);

    $("[name='request-site-choice']").unbind( "click", requestSiteClick);
    $("[name='request-site-choice']").bind( "click", requestSiteClick);

    $("[name='request-action-choice']").unbind( "click", requestActionChoiceClick);
    $("[name='request-action-choice']").bind( "click", requestActionChoiceClick);

    $("[name='user-ubi-choice']").unbind( "click", userUbiChoiceClick);
    $("[name='user-ubi-choice']").bind( "click", userUbiChoiceClick);

    $("#popUpInner").unbind( "click", popUpInnerClick);
    $("#popUpInner").bind( "click", popUpInnerClick);

    $("#newComment").unbind( "click", newCommentClick);
    $("#newComment").bind( "click", newCommentClick);

    $("#approveRedirect").unbind( "click", approveRedirectClick);
    $("#approveRedirect").bind( "click", approveRedirectClick);

    $(".approveRedirect").unbind( "click", approveRedirectClick);
    $(".approveRedirect").bind( "click", approveRedirectClick);

    $("#cancelRedirect").unbind( "click", cancelRedirectClick);
    $("#cancelRedirect").bind( "click", cancelRedirectClick);

    $("#submitRedirectStatusDates").unbind( "click", submitRedirectStatusDatesClick);
    $("#submitRedirectStatusDates").bind( "click", submitRedirectStatusDatesClick);

    //$("#submitRedirectGroupedByStatusDates").unbind( "click", submitRedirectGroupedByStatusDatesClick);
    //$("#submitRedirectGroupedByStatusDates").bind( "click", submitRedirectGroupedByStatusDatesClick);

    $("#instaActivateRedirect").unbind( "click", instaActivateRedirectClick);
    $("#instaActivateRedirect").bind( "click", instaActivateRedirectClick);

    $("#feedback_button").unbind( "click", feedbackButtonClick);
    $("#feedback_button").bind( "click", feedbackButtonClick);

    $("#rejectRedirect").unbind( "click", rejectRedirectClick);
    $("#rejectRedirect").bind( "click", rejectRedirectClick);

    $(".rejectRedirect").unbind( "click", rejectRedirectClick);
    $(".rejectRedirect").bind( "click", rejectRedirectClick);

    $("#popUpSubmitButton").unbind( "click", popUpSubmitButtonClick);
    $("#popUpSubmitButton").bind( "click", popUpSubmitButtonClick);

    $("#popUpContainer").unbind( "click", popUpContainerClick);
    $("#popUpContainer").bind( "click", popUpContainerClick);

    $("#redirectRequest_submitButton").unbind( "click", redirectRequest_submitButtonClick);
    $("#redirectRequest_submitButton").bind( "click", redirectRequest_submitButtonClick);

    $("#DNSRequest_submitButton").unbind( "click", DNSRequest_submitButtonClick);
    $("#DNSRequest_submitButton").bind( "click", DNSRequest_submitButtonClick);

    $("#editRequest").unbind( "click", editRequestClick);
    $("#editRequest").bind( "click", editRequestClick);

    $("#redirectRequest_addListOfRedirects").unbind( "click", addListOfRedirectsClick);
    $("#redirectRequest_addListOfRedirects").bind( "click", addListOfRedirectsClick);

    $("#applyFilters").unbind( "click", applyFiltersClick);
    $("#applyFilters").bind( "click", applyFiltersClick);

    $("#cancelFilters").unbind( "click", cancelFiltersClick);
    $("#cancelFilters").bind( "click", cancelFiltersClick);

    $("#adminEmailSend").unbind( "click", adminEmailSendClick);
    $("#adminEmailSend").bind( "click", adminEmailSendClick);

    $('#adminNotifiSend').unbind( "click", adminNotifiSendClick);
    $('#adminNotifiSend').bind( "click", adminNotifiSendClick);

    $("#admin_email_subject").unbind( "change", adminEmailSubjectChange);
    $("#admin_email_subject").bind( "change", adminEmailSubjectChange);
    /*
    $("#admin_email_group_address").unbind( "change", adminEmailAddressChange);
    $("#admin_email_group_address").bind( "change", adminEmailAddressChange);
    */
    /*
    $("input[name=radio_to_group]").unbind( "change", adminRadioToChange);
    $("input[name=radio_to_group]").bind( "change", adminRadioToChange);

    $("input[name=radio_to_group]").change();
    */
    $("#admin_email_content").unbind( "change", adminEmailContentChange);
    $("#admin_email_content").bind( "change", adminEmailContentChange);
    /*
    $("#admin_notifi_address").unbind( "change", adminNotifyAddressChange);
    $("#admin_notifi_address").bind( "change", adminNotifyAddressChange);
    */
    $("#admin_notifi_content").unbind( "change", adminNotifyContentChange);
    $("#admin_notifi_content").bind( "change", adminNotifyContentChange);
    /*
    $("#admin_notifi_link").unbind( "change", adminNotifyLinkChange);
    $("#admin_notifi_link").bind( "change", adminNotifyLinkChange);
    */

    $("#testRegexOperations").unbind( "click", testRegexOperationsClick);
    $("#testRegexOperations").bind( "click", testRegexOperationsClick);

    $("#siteownerinspector_html_report").unbind( "click", siteownerInspectorHTMLReportClick);
    $("#siteownerinspector_html_report").bind( "click", siteownerInspectorHTMLReportClick);

    $("#siteownerinspector_export").unbind( "click", siteownerInspectorExportClick);
    $("#siteownerinspector_export").bind( "click", siteownerInspectorExportClick);

    $(".using-close-button>.ds-row").unbind( "click", notClosingOverlay);
    $(".using-close-button>.ds-row").bind( "click", notClosingOverlay);

    $(".using-close-button").unbind( "click", closeOverlay);
    $(".using-close-button").bind( "click", closeOverlay);

    $(".using-close-button .close-button").unbind( "click", closeOverlay);
    $(".using-close-button .close-button").bind( "click", closeOverlay);

    //also move and check this part?
    [].forEach.call($('.tags'), tagsInput);

    $(".addedUrlsList div").each(function(){

        if($(this).hasClass("addedUrlsListSource"))
        {
            var typeURLDIV = $(this).prev();
            var sourceURLDIV = $(this);
            var targetURLDIV = $(this).next();
            var flagURLDIV = targetURLDIV.next();

            var URLData = {};
            URLData.sourceURL = decodeEntities(sourceURLDIV.html());
            URLData.targetURL = decodeEntities(targetURLDIV.html());
            URLData.statusCode = decodeEntities(flagURLDIV.html());

            URLData.regex = false;
            URLData.subst = false;
            URLData.vanity = false;
            URLData.type = "request-type-redirect";
            var tooltipContent = typeURLDIV.find(".ds-tooltip-content").html();

            if(tooltipContent)
            {
                if(tooltipContent.indexOf("Regex") != -1)
                {
                    URLData.regex = true;
                }
                if(tooltipContent.indexOf("Substitution") != -1)
                {
                    URLData.subst = true;
                }
                if(tooltipContent.indexOf("Vanity URL") != -1)
                {
                    URLData.vanity = true;
                }
                if(tooltipContent.indexOf("Redirect") != -1)
                {
                    URLData.type = "request-type-redirect";
                }
                else if(tooltipContent.indexOf("Reservation") != -1)
                {
                    URLData.type = "request-type-naming";
                }
                else if(tooltipContent.indexOf("Deletion") != -1)
                {
                    URLData.type = "request-type-deletion";
                }
                else if(tooltipContent.indexOf("Routing") != -1)
                {
                    URLData["type"] = "request-type-routing";
                }
                URLData["isW3"] = false;
                URLData["isIBM"] = false;
                URLData["isOther"] = false;
                if(tooltipContent.indexOf("Internal") != -1)
                {
                    URLData["isW3"] = true;
                }
                if(tooltipContent.indexOf("External") != -1)
                {
                    URLData["isIBM"] = true;
                }
                if(tooltipContent.indexOf("Other") != -1)
                {
                    URLData["isOther"] = true;
                }
            }
            redirectRequest_addedURLS[(decodeEntities(URLData["sourceURL"])+decodeEntities(URLData["targetURL"]))] = URLData;
        }
    });
    processUBIRadioButtons();
    processRequestChoiceRadioButtons(true);
    processSiteChoiceRadioButtons(false);

    $("#statusCode").change(function() {
        updateTargetSourceFields(this);
    });

    var userUbiChoiceChangeFunction = function() {
        var optionData = $("#user-ubi-choice-has-number").find(':selected').val();
        if(typeof optionData != "undefined" && optionData != "disabled")
        {
            optionData = decodeEntities(optionData);
            showLoader("Getting UBI data...");
            $.getJSON( prefixPath+"/API/getBillingRecordData.php", { id: optionData } )
            .done(function( data ) {
                if(data.success)
                {
                    hideLoader();
                    optionData = data.data;

                    if(typeof optionData.account_id !== "undefined")
                    {
                        $("#user-ubi-choice-create-billing-accountid-readOnly").val(optionData.account_id).trigger('change');
                    }
                    if(typeof optionData.business_unit !== "undefined")
                    {
                        $("#user-ubi-choice-create-business-unit-readOnly").val(optionData.business_unit).trigger('change');
                    }
                    if(typeof optionData.dept !== "undefined")
                    {
                        $("#user-ubi-choice-create-billing-dept-readOnly").val(optionData.dept).trigger('change');
                    }
                    if(typeof optionData.div !== "undefined")
                    {
                        $("#user-ubi-choice-create-billing-div-readOnly").val(optionData.div).trigger('change');
                    }
                    if(typeof optionData.location_code !== "undefined")
                    {
                        $("#user-ubi-choice-create-billing-location-readOnly").val(optionData.location_code).trigger('change');
                    }
                    if(typeof optionData.major !== "undefined")
                    {
                        $("#user-ubi-choice-create-billing-major-readOnly").val(optionData.major).trigger('change');
                    }
                    if(typeof optionData.minor !== "undefined")
                    {
                        $("#user-ubi-choice-create-billing-minor-readOnly").val(optionData.minor).trigger('change');
                    }
                    if(typeof optionData.name !== "undefined")
                    {
                        $("#user-ubi-choice-create-project-name-readOnly").val(optionData.name).trigger('change');
                    }
                    $("#user-ubi-choice-create-billing-approving-manager-readOnly").parent().find(".tag").remove();
                    var str, i;
                    if(typeof optionData.approving_managers !== "undefined")
                    {
                        str = "";
                        for(i = 0; i < optionData.approving_managers.length; i++)
                        {
                            str+=optionData.approving_managers[i] + ",";
                        }
                        str = str.replace(/,\s*$/, "");
                        $("#user-ubi-choice-create-billing-approving-manager-readOnly").val(str);
                        //$("#user-ubi-choice-create-billing-approving-manager-readOnly").parent().children("div").children("input").val(str).focus().trigger('change').trigger('blur');
                    }
                    $("#user-ubi-choice-create-contact-persons-readOnly").parent().find(".tag").remove();
                    if(typeof optionData.contact_persons !== "undefined")
                    {
                        str = "";
                        for(i = 0; i < optionData.contact_persons.length; i++)
                        {
                            str+=optionData.contact_persons[i] + ",";
                        }
                        str = str.replace(/,\s*$/, "");
                        $("#user-ubi-choice-create-contact-persons-readOnly").val(str);
                        //$("#user-ubi-choice-create-contact-persons-readOnly").parent().children("div").children("input").val(str).focus().trigger('change').trigger('blur');
                    }
                    $("#user-ubi-choice-create-billing-approving-fmanager-readOnly").parent().find(".tag").remove();
                    if(typeof optionData.financial_managers !== "undefined")
                    {
                        str = "";
                        for(i = 0; i < optionData.financial_managers.length; i++)
                        {
                            str+=optionData.financial_managers[i] + ",";
                        }
                        str = str.replace(/,\s*$/, "");
                        $("#user-ubi-choice-create-billing-approving-fmanager-readOnly").val(str);
                        //$("#user-ubi-choice-create-billing-approving-fmanager-readOnly").parent().children("div").children("input").val(str).focus().trigger('change').trigger('blur');
                    }
                }
                else
                {
                    hideLoader();
                    showNotice("error","Error",data.message);
                }
            });
        }
    };
    setTimeout(function() {
        userUbiChoiceChangeFunction();
    }, 100); //sorry for this timeout, this is to fix tags not converting

    $("#user-ubi-choice-has-number").change(function(){
        userUbiChoiceChangeFunction();
    });

    var inputs = $("input");
    inputs.keyup(function(e) {
        if(e.which !== 9)
        {
            verifyInputs(this);
        }
    });
    inputs.change(function() {
        verifyInputs(this);
    });
    var textAreas = $("textarea");
    textAreas.keyup(function(e) {
        if(e.which !== 9)
        {
            verifyInputs(this);
        }
    });
    textAreas.change(function() {
        verifyInputs(this);
    });

    URTListWindowResize(false);

    //also move and check this part? - end
}

function showNotice(type,titleText,bodyText,showCloseButton)
{
    if(typeof showCloseButton == "undefined")
    {
        showCloseButton = true;
    }

    showBlur();
    var alertElem = $("#noticeContainer");
    var alertTypeElem = alertElem.find("#alertType");
    var alertTitleElem = alertElem.find("#alertTitle");
    var alertTextElem = alertElem.find("#alertText");
    var alertCloseButtonContainerElem = alertElem.find("#alertCloseButtonContainer");
    if(showCloseButton)
    {
        alertCloseButtonContainerElem.show();
    }
    else
    {
        alertCloseButtonContainerElem.hide();
    }
    alertTypeElem.removeClass("ds-error");
    alertTypeElem.removeClass("ds-warning");
    alertTypeElem.removeClass("ds-success");
    alertTypeElem.removeClass("ds-info");
    switch(type) {
        case "error":
            alertTypeElem.addClass("ds-error");
            alertTitleElem.html('<span class="ds-icon-alert ds-margin-right-1"></span>'+titleText);
            alertTextElem.html(bodyText);
            break;
        case "warning":
            alertTypeElem.addClass("ds-warning");
            alertTitleElem.html('<span class="ds-icon-alert ds-margin-right-1"></span>'+titleText);
            alertTextElem.html(bodyText);
            break;
        case "success":
            alertTypeElem.addClass("ds-success");
            alertTitleElem.html('<span class="ds-icon-check ds-margin-right-1"></span>'+titleText);
            alertTextElem.html(bodyText);
            break;
        case "info":
            alertTypeElem.addClass("ds-info");
            alertTitleElem.html('<span class="ds-icon-info ds-margin-right-1"></span>'+titleText);
            alertTextElem.html(bodyText);
            break;
        default:
            alertTypeElem.addClass("ds-info");
            alertTitleElem.html('<span class="ds-icon-info ds-margin-right-1"></span>'+titleText);
            alertTextElem.html(bodyText);
    }
    alertElem.fadeIn(250);
}

function setContent(html)
{
    $("#contentContainer").html(html);
    reReady();
}

function refreshRedirect(id, func)
{
    $.getJSON( prefixPath+"/API/getRedirectRequestHTML.php", { id: id } )
    .done(function( data ) {
        if(data.success)
        {
            setContent(data.data);
            w3ds.init();
            func();
        }
    });
}

function closeNotice()
{
    var alertElem = $("#noticeContainer");
    removeBlur();
    alertElem.fadeOut(250);
}

function closeOverlay(e, directContainer, callback)
{
    var container = (typeof directContainer !== 'undefined') ? directContainer : $(this).closest('.using-close-button');

    $('html, body').css({
        overflow: 'auto'
    });
    removeBlur();
    container.fadeOut(250, function() {
        if (typeof callback === 'function') callback();
    });
}

function notClosingOverlay(e)
{
    e.stopPropagation();
}

function setNotificationCount(count)
{
    if(count == 0)
    {
        $("#notification-button").next().hide();
    }
    else
    {
        $("#notification-button").next().html(count);
        $("#notification-button").next().show();
    }
}

function businessDaysFromDate(date,businessDays) {
  var counter = 0, tmp = new Date(date);
  while( businessDays>=0 ) {
    tmp.setTime( date.getTime() + counter * 86400000 );
    if(isBusinessDay (tmp)) {
      --businessDays;
    }
    ++counter;
  }
  return tmp;
}

function isBusinessDay (date) {
  var dayOfWeek = date.getDay();
  if(dayOfWeek === 0 || dayOfWeek === 6) {
    // Weekend
    return false;
  }

  holidays = [
    '12/31+5', // New Year's Day on a saturday celebrated on previous friday
    '1/1',     // New Year's Day
    '1/2+1',   // New Year's Day on a sunday celebrated on next monday
    '1-3/1',   // Birthday of Martin Luther King, third Monday in January
    '2-3/1',   // Washington's Birthday, third Monday in February
    '5~1/1',   // Memorial Day, last Monday in May
    '7/3+5',   // Independence Day
    '7/4',     // Independence Day
    '7/5+1',   // Independence Day
    '9-1/1',   // Labor Day, first Monday in September
    '10-2/1',  // Columbus Day, second Monday in October
    '11/10+5', // Veterans Day
    '11/11',   // Veterans Day
    '11/12+1', // Veterans Day
    '11-4/4',  // Thanksgiving Day, fourth Thursday in November
    '12/24+5', // Christmas Day
    '12/25',   // Christmas Day
    '12/26+1',  // Christmas Day
  ];

  var dayOfMonth = date.getDate(),
  month = date.getMonth() + 1,
  monthDay = month + '/' + dayOfMonth;

  if(holidays.indexOf(monthDay)>-1){
    return false;
  }

  var monthDayDay = monthDay + '+' + dayOfWeek;
  if(holidays.indexOf(monthDayDay)>-1){
    return false;
  }

  var weekOfMonth = Math.floor((dayOfMonth - 1) / 7) + 1,
      monthWeekDay = month + '-' + weekOfMonth + '/' + dayOfWeek;
  if(holidays.indexOf(monthWeekDay)>-1){
    return false;
  }

  var lastDayOfMonth = new Date(date);
  lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
  lastDayOfMonth.setDate(0);
  var negWeekOfMonth = Math.floor((lastDayOfMonth.getDate() - dayOfMonth - 1) / 7) + 1,
      monthNegWeekDay = month + '~' + negWeekOfMonth + '/' + dayOfWeek;
  if(holidays.indexOf(monthNegWeekDay)>-1){
    return false;
  }

  return true;
}


//date format yyyy-mm-dd
function calculateLatestProcessingDate(date)
{
    if(date instanceof Date && !isNaN(date.valueOf()))
    {
        var year = date.substring(0,4);
        var month = date.substring(5,7);
        var day = date.substring(8,10);
        date = new Date(year, month-1, day);
        var newDate = businessDaysFromDate(date,4);
        newDate.setDate(newDate.getDate() + 1);
        return newDate.toISOString().slice(0,10);
    }
    return false;
}

var recordsTable;
var tableForURLsInRequest;
var tableAdminBlockingPatterns;
var tableAdminPredefinedMessages;
var tableAdminNotifPatterns;
var tableAdminUserGroupsPatterns;
var tableAdminUserGroupsAddPatterns;
var tableAdminGroupSettingsUsers;
var tableAdminGroupSettingsModules;
var tableAdminGroupSettings;



$( document ).ready(function() {
    if($("#server_time").length)
    {
        clearInterval(timeRefreshingTimer);
        timeRefreshingTimer = setInterval(function() {
            $.get(prefixPath+"/API/getTime.php", function( data ) {
                $("#server_time").html(data);
            });
        }, 60000);
    }

    //this is in two places, with different settings
    tableAdminGroupSettingsUsers = $('#groupSettings_users').DataTable( {
        serverSide: false,
        "order":
            [
                [ 1, "asc" ]
            ],
        "bPaginate": false,
        responsive: true,
        "bInfo" : false,
        searching: false,
        "ordering": false
    } );

    tableAdminGroupSettingsModules = $('#groupSettings_modules').DataTable( {
        serverSide: false,
        "order":
            [
                [ 1, "asc" ]
            ],
        "bPaginate": false,
        responsive: true,
        "bInfo" : false,
        searching: false,
        "ordering": false
    } );

    /*$('#groupSettings_users').on('draw.dt', function() {
        reReady();
    });*/

    tableAdminGroupSettings = $('#groupSettings').DataTable( {
        serverSide: false,
        "order":
            [
                [ 1, "asc" ]
            ],
        "bPaginate": false,
        responsive: true,
        "bInfo" : false,
        searching: false,
        "ordering": false,
        "columnDefs": [
            { "width": "5%", "targets": 0 },
            { "width": "5%", "targets": 1 },
            { "width": "30%", "targets": 2 }
        ],
        autoWidth: false
    } );

    tableAdminBlockingPatterns = $('#blockPatterns').DataTable( {
        serverSide: false,
        "order":
        [
            [ 1, "asc" ]
        ],
        "bPaginate": false,
        responsive: true,
        "bInfo" : false,
        searching: false,
        "ordering": false
    } );

    tableAdminPredefinedMessages = $('#predefinedMessages').DataTable( {
        serverSide: false,
        "order":
        [
            [ 1, "asc" ]
        ],
        "bPaginate": false,
        responsive: true,
        "bInfo" : false,
        searching: false,
        "ordering": false
    } );

    tableAdminNotifPatterns = $('#notifPatterns').DataTable( {
        serverSide: false,
        "order":
        [
            [ 1, "asc" ]
        ],
        "bPaginate": false,
        responsive: true,
        "bInfo" : false,
        searching: false,
        "ordering": false
    } );

    tableAdminUserGroupsPatterns = $('#userGroupsPatterns').DataTable( {
        serverSide: false,
        "order":
        [
            [ 1, "asc" ]
        ],
        "bPaginate": false,
        responsive: true,
        "bInfo" : false,
        searching: false,
        "ordering": false
    } );

    tableAdminUserGroupsAddPatterns = $('#userGroupsAddPatterns').DataTable( {
        serverSide: false,
        "order":
        [
            [ 1, "asc" ]
        ],
        "bPaginate": false,
        responsive: true,
        "bInfo" : false,
        searching: false,
        "ordering": false
    } );

    if($("#statusLogTable").length )
    {
        tableAdminStatusLog_config = {
            columnDefs: [
                {
                    className: "status-type",
                    targets: 0
                },
                {
                    className: "status-mess",
                    targets: 1
                }
            ],
            responsive: true,
            serverSide: false,
            bPaginate: false,
            bLengthChange: false,
            bInfo : false,
            searching: false,
            ordering: false,
            autoWidth: false
        };

        tableAdminStatusLog = $('#statusLogTable').DataTable( tableAdminStatusLog_config );
    }

    tableAdminTestingCommits = $('#testingCommits').DataTable( {
        order:
        [
            [ 0, "desc" ]
        ],
        columnDefs: [
            {
                className: "commits",
                targets: 1
            },
            {
                className: "commit-link",
                targets: 2
            },
            { "orderable": false }
        ],
        responsive: true,
        serverSide: false,
        bPaginate: true,
        bLengthChange: false,
        bInfo : false,
        searching: true,
        ordering: true,
        autoWidth: false
    } );

    tableAdminBetaCommits = $('#betaCommits').DataTable( {
        order:
        [
            [ 0, "desc" ]
        ],
        columnDefs: [
            {
                className: "commits",
                targets: 1
            },
            {
                className: "commit-link",
                targets: 2
            },
            { "orderable": false }
        ],
        responsive: true,
        serverSide: false,
        bPaginate: true,
        bLengthChange: false,
        bInfo : false,
        searching: true,
        ordering: true,
        autoWidth: false
    } );

    tableAdminMasterCommits = $('#masterCommits').DataTable( {
        order:
        [
            [ 0, "desc" ]
        ],
        columnDefs: [
            {
                className: "commits",
                targets: 1
            },
            {
                className: "commit-link",
                targets: 2
            },
            { "orderable": false }
        ],
        responsive: true,
        serverSide: false,
        bPaginate: true,
        bLengthChange: false,
        bInfo : false,
        searching: true,
        ordering: true,
        autoWidth: false
    } );

    recordsTable = $('#recordsTable').DataTable( {
        serverSide: true,
        "processing": true,
        ajax: {
            url: prefixPath+'API/getRecords.php',
            type: 'POST'
        },
        "columns":
        [
            { "name": "requestNumber", "bSortable": true },
            { "name": "requestName", "bSortable": true },
            { "name": "submitter", "bSortable": true },
            { "name": "submitted", "bSortable": true },
            { "name": "status", "bSortable": true }
        ],
        "order":
        [
            [ 0, "desc" ]
        ],
        "drawCallback": function( settings ) {
            exportSearchRecords['search_string'] = settings.oAjaxData.search.value;
            exportSearchRecords['records_filtered'] = settings.json.recordsFiltered;

            $("#filtersForRecords").find("input").attr("disabled",false);
            $("#filtersForRecords").find("input").removeClass("ds-disabled");
            $("#filtersForRecords").find("select").attr("disabled",false);
            $("#filtersForRecords").find("select").removeClass("ds-disabled");
            $("#filtersForRecords").find("button").attr("disabled",false);
            $("#filtersForRecords").find("button").removeClass("ds-disabled");
            hideLoader();
        }
    } );

    $("#searchInput")
        .unbind()
        .bind('keyup change', function (e) {
        if (e.keyCode == 13 || this.value == "") {
            $search_string = runSearch();
        }
    });

    $("#sourceURL")
        .unbind()
        .bind('keyup change', function (e) {
        if (e.keyCode == 13 || this.value == "") {
            sourceURLVerifyClick();
        }
    });


    if($("#statusLog").length )
    {
        setInterval(
            function()
            {
                $.getJSON( prefixPath+"/API/getStatusMessagesHTML.php" )
                .done(function(data) {
                    $("#statusLog").html(data.data);
                });
            }, 3000);
    }

    var newDate = calculateLatestProcessingDate($("#earliest-processing-date").val());
    if(newDate) $("#latest-processing-date").html(newDate);
    $("#earliest-processing-date").change(function(e){
        var newDate = calculateLatestProcessingDate($(this).val());
        if(newDate) $("#latest-processing-date").html(newDate);
    });

    reReady();
});

function getURLsData()
{
    return redirectRequest_addedURLS;
}

function getDNSData()
{
    return redirectRequest_addedDNS;
}

function getTagsData()
{
    var tagsData = {};
    $.each($(".ds-input-container"), function(i, name) {
        var elemID = $(this).attr('id');
        if(elemID)
        {
            if (elemID.indexOf('-tags-container') > -1) {
                $(this).find(".tag").each(function( index ) {
                    var fieldName = elemID.replace("-tags-container","");
                    if(!tagsData[fieldName]) tagsData[fieldName] = [];
                    tagsData[fieldName].push({"email":$(this).text(),"valid":$(this).data("email-valid")});
                });
            }
        }
    });
    return tagsData;
}

function addErrorToInput(input,text,parent)
{
    parent = parent || $(input).parent();
    removeErrorFromInput(input,parent);
    parent.append('<p class="ds-input-msg ds-error">'+text+'</p>');
    $(input).addClass("ds-error");
}

function removeErrorFromInput(input,parent)
{
    parent = parent || $(input).parent();
    parent.find(".ds-input-msg").remove();
    $(input).removeClass("ds-error");
}

// TODO: !IMPORTANT - check before, if it's escaped already (incude & before)

function escapeHtml(unsafe) {
    var escaped = "";
    try {
        escaped = unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        return escaped;
    }
    catch(err) {
        console.log("EscapeHTML function has failed!");
        return "";
    }
}


var tags_special_first_run = [];
function verifyInputs(_this,altID)
{
    var inputVal;
    var inputID = altID || $(_this).attr("id");
    //special fix for all inputs that have tags system

    if(
        inputID == "site_owner_email" ||
        inputID == "send_notifications_to"
    )
    {
        inputID = "tags_special";
    }
    if($(_this))
    {
        try {
            inputVal = $(_this).val();
            if(typeof inputVal !== "undefined")
            {
                inputVal = inputVal.trim();
            }
            else
            {
                inputVal = false;
            }
        }
        catch(err) {
            inputVal = false;
        }
    }
    else
    {
        inputVal = false;
    }
    if(inputID && inputVal !== false)
    {
        switch (inputID) {
            case "allow-activation-date":
                var earDateElem = $("#earliest-processing-date");
                var earTimeElem = $("#earliest-processing-time");
                if($(_this).is(":checked")) {
                    earDateElem.attr("disabled",false);
                    earDateElem.attr("readonly",false);
                    earDateElem.removeClass("ds-disabled");
                    earTimeElem.attr("disabled",false);
                    earTimeElem.attr("readonly",false);
                    earTimeElem.removeClass("ds-disabled");
                    verifyInputs($("#earliest-processing-date"),"earliest-processing-date");
                    verifyInputs($("#earliest-processing-time"),"earliest-processing-time");
                }
                else {
                    earDateElem.attr("disabled",true);
                    earDateElem.attr("readonly",true);
                    earDateElem.addClass("ds-disabled");
                    earTimeElem.attr("disabled",true);
                    earTimeElem.attr("readonly",true);
                    earTimeElem.addClass("ds-disabled");
                    verifyInputs($("#earliest-processing-date"),"earliest-processing-date");
                    verifyInputs($("#earliest-processing-time"),"earliest-processing-time");
                }
                break;
            case "allow-expiration-date":
                var expDateElem = $("#expiration-date");
                var expTimeElem = $("#expiration-time");
                if($(_this).is(":checked")) {
                    expDateElem.attr("disabled",false);
                    expDateElem.removeClass("ds-disabled");
                    expTimeElem.attr("disabled",false);
                    expTimeElem.removeClass("ds-disabled");
                    verifyInputs($("#expiration-date"),"expiration-date");
                    verifyInputs($("#expiration-time"),"expiration-time");
                }
                else {
                    expDateElem.attr("disabled",true);
                    expDateElem.addClass("ds-disabled");
                    expTimeElem.attr("disabled",true);
                    expTimeElem.addClass("ds-disabled");
                    verifyInputs($("#expiration-date"),"expiration-date");
                    verifyInputs($("#expiration-time"),"expiration-time");
                }
                break;
            case "site-description":
                //verification for imap number
                if(inputVal == "")
                {
                    addErrorToInput(_this,"Site description cannot be empty.");
                }
                else
                {
                    //verfication ok
                    removeErrorFromInput(_this);
                }
                break;
            case "source-url":
                if(inputVal == "")
                {
                    //addErrorToInput(_this,"Source URL cannot be empty.");
                }
                else
                {
                    //verfication ok
                    removeErrorFromInput(_this);
                }
                break;
            case "earliest-processing-date":
                if($("#allow-activation-date").is(":checked"))
                {
                    if(inputVal == "")
                    {
                        addErrorToInput(_this,"Earliest processing date has to be set.");
                    }
                    else
                    {
                        //verfication ok
                        removeErrorFromInput(_this);
                    }
                }
                else
                {
                    removeErrorFromInput(_this);
                }
                break;
            case "earliest-processing-time":
                if($("#allow-activation-date").is(":checked"))
                {
                    if(inputVal == "")
                    {
                        addErrorToInput(_this,"Earliest processing time has to be set.");
                    }
                    else
                    {
                        //verfication ok
                        removeErrorFromInput(_this);
                    }
                }
                else
                {
                    removeErrorFromInput(_this);
                }
                break;
            case "expiration-date":
                if($("#allow-expiration-date").is(":checked"))
                {
                    if(inputVal == "")
                    {
                        addErrorToInput(_this,"Expiration date has to be set or turned off.");
                    }
                    else
                    {
                        //verfication ok
                        removeErrorFromInput(_this);
                    }
                }
                else
                {
                    removeErrorFromInput(_this);
                }
                break;
            case "expiration-time":
                if($("#allow-expiration-date").is(":checked"))
                {
                    if(inputVal == "")
                    {
                        addErrorToInput(_this,"Expiration time has to be set or turned off.");
                    }
                    else
                    {
                        //verfication ok
                        removeErrorFromInput(_this);
                    }
                }
                else
                {
                    removeErrorFromInput(_this);
                }
                break;
            case "trademark-investigation":
                if(!$(_this).is(":checked"))
                {
                    addErrorToInput(_this,"Trademark investigation has to be read and checked.");
                }
                else
                {
                    removeErrorFromInput(_this);
                }
                break;
            case "user-ubi-choice-create-project-name":
                if(inputVal == "")
                {
                    addErrorToInput(_this,"Project name cannot be empty.");
                }
                else
                {
                    //verfication ok
                    removeErrorFromInput(_this);
                }
                break;
            case "user-ubi-choice-create-billing-major":
                if(inputVal == "")
                {
                    addErrorToInput(_this,"Billing major cannot be empty.");
                }
                else
                {
                    //verfication ok
                    removeErrorFromInput(_this);
                }
                break;
            case "user-ubi-choice-create-billing-minor":
                if(inputVal == "")
                {
                    addErrorToInput(_this,"Billing minor cannot be empty.");
                }
                else
                {
                    //verfication ok
                    removeErrorFromInput(_this);
                }
                break;
            case "user-ubi-choice-create-billing-dept":
                if(inputVal == "")
                {
                    addErrorToInput(_this,"Billing department cannot be empty.");
                }
                else
                {
                    //verfication ok
                    removeErrorFromInput(_this);
                }
                break;
            case "user-ubi-choice-create-billing-accountid":
                if(inputVal == "")
                {
                    addErrorToInput(_this,"Billing account ID cannot be empty.");
                }
                else
                {
                    //verfication ok
                    removeErrorFromInput(_this);
                }
                break;
            case "user-ubi-choice-create-billing-div":
                if(inputVal == "")
                {
                    addErrorToInput(_this,"Billing division cannot be empty.");
                }
                else
                {
                    //verfication ok
                    removeErrorFromInput(_this);
                }
                break;
            case "tags_special":
                var thisTagsInput;
                if($(_this).attr("class") !== "tags")
                {
                    thisTagsInput = $(_this).parent().parent().children("input").attr("id");
                }
                else {
                    _this = $(_this).parent().children(".tags-input").children("input");
                    thisTagsInput = false;
                }

                if(typeof tags_special_first_run[thisTagsInput] == "undefined")
                {
                    tags_special_first_run[thisTagsInput] = true;
                    return true;
                }


                var errorFound = false;

                var tagsNum = $(_this).parent().children(".tag").length;

                if(tagsNum == 0 && $(_this).parent().parent().children("input").is(":required"))
                {
                    addErrorToInput($(_this).parent(),"Enter at least one email.",$(_this).parent().parent());
                    errorFound = true;
                }
                else
                {
                    $(_this).parent().children(".tag").each(function(){
                        if($(this).data("email-valid") === false)
                        {
                            addErrorToInput($(_this).parent(),"E-mail "+escapeHtml($(this).html())+" is not valid.",$(_this).parent().parent());
                            errorFound = true;
                        }
                    });
                }

                if(inputVal !== "")
                {
                    if(!validateEmail(inputVal)) //this is needed
                    {
                        addErrorToInput($(_this).parent(),"Email you are trying to add is not valid.",$(_this).parent().parent());
                        errorFound = true;
                    }
                }
                if(!errorFound)
                {
                    removeErrorFromInput($(_this).parent(),$(_this).parent().parent());
                }
                if(tagsNum > 0)
                {
                    $(_this).attr("placeholder","");
                }
                else
                {
                    $(_this).attr("placeholder","e.g., jdoe@us.ibm.com");
                }
        }
    }
}

function verifyTags(elem,value)
{
    var tagsTexts = value.replace(/ /g,'').split(",");

    if(value == "" && typeof currentElem != "undefined")
    {
        $(elem).prop('disabled', false);
        return true;
    }
    else
    {
        if(validateEmail(value))
        {
            return function(tag,elem){
                verifyInputs(elem,"tags_special");
                var foundTag = false;

                var doStuff = function(i) {
                    var localTag = tag[i];
                    $.getJSON( prefixPath+"/API/getBPInfo.php", { email: $(localTag).html() } )
                    .done(function( data ) {
                        if(data.success)
                        {
                            $(localTag).css("background","#EEE");
                            localTag.setAttribute('data-email-valid', "true");
                            verifyInputs(elem,"tags_special");
                        }
                        else
                        {
                            $(localTag).css("background","#f96358");
                            localTag.setAttribute('data-email-valid', "false");
                            verifyInputs(localTag,"tags_special");
                        }
                    });
                };
                for(var i = (tag.length - tagsTexts.length); i < tag.length; i++) doStuff(i);
            };
        }
        else
        {
            verifyInputs(elem,"tags_special");
            return false;
        }
    }
}

var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

function validateEmail(email) {
    var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    return re.test(email);
}

function checkFileList(fileInput, filesArray) {
    var files = (typeof filesArray !== 'undefined')? filesArray : fileInput.prop("files");
    var msgArea = fileInput.closest(".file-area").siblings(".file-msg").children(".ds-file-upload-msg");
    var c = files.length;
    var msg = "No file selected";

    if (c > 0) {
        msg = c + " file" + ((c > 1)? "s" : "")  + " selected";
    }

    msgArea.html(msg);
}