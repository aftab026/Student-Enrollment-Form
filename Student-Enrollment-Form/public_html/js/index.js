// Database details
var DB_NAME = "SCHOOL-DB";
var RELATION_NAME = "STUDENT-TABLE";
var BASE_URL = "http://api.login2explore.com:5577";
var IML = "/api/iml";
var IRL = "/api/irl";
var TOKEN = "90932196|-31949215867291122|90963509";

$(document).ready(function() {
    $("#rollno").focus();
});

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getStudentIdAsJsonObj() {
    var rollno = $("#rollno").val();
    var jsonStr = {
        id: rollno
    };
    return JSON.stringify(jsonStr);
}

function fillStudentData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#fullname").val(record.fullname);
    $("#class").val(record.class);
    $("#birthdate").val(record.birthdate);
    $("#address").val(record.address);
    $("#enrollmentdate").val(record.enrollmentdate);
    enableStudentFields();
}

function resetStudentForm() {
    $("#rollno").val("");
    $("#fullname").val("");
    $("#class").val("");
    $("#birthdate").val("");
    $("#address").val("");
    $("#enrollmentdate").val("");
    disableStudentFields();
    $("#rollno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#update").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollno").focus();
}

function validateStudentData() {
    var rollno, fullname, classValue, birthdate, address, enrollmentdate;
    rollno = $("#rollno").val();
    fullname = $("#fullname").val();
    classValue = $("#class").val();
    birthdate = $("#birthdate").val();
    address = $("#address").val();
    enrollmentdate = $("#enrollmentdate").val();

    if (rollno === "") {
        alert("Roll No missing");
        $("#rollno").focus();
        return "";
    }
    if (fullname === "") {
        alert("Full Name missing");
        $("#fullname").focus();
        return "";
    }
    if (classValue === "") {
        alert("Class missing");
        $("#class").focus();
        return "";
    }
    if (birthdate === "") {
        alert("Birth Date missing");
        $("#birthdate").focus();
        return "";
    }
    if (address === "") {
        alert("Address missing");
        $("#address").focus();
        return "";
    }
    if (enrollmentdate === "") {
        alert("Enrollment Date missing");
        $("#enrollmentdate").focus();
        return "";
    }

    var jsonStrObj = {
        rollNo: rollno,
        fullName: fullname,
        class: classValue,
        birthDate: birthdate,
        address: address,
        enrollmentDate: enrollmentdate
    };
    return JSON.stringify(jsonStrObj);
}

function enableStudentFields() {
    $("#fullname").prop("disabled", false);
    $("#class").prop("disabled", false);
    $("#birthdate").prop("disabled", false);
    $("#address").prop("disabled", false);
    $("#enrollmentdate").prop("disabled", false);
}

function disableStudentFields() {
    $("#fullname").prop("disabled", true);
    $("#class").prop("disabled", true);
    $("#birthdate").prop("disabled", true);
    $("#address").prop("disabled", true);
    $("#enrollmentdate").prop("disabled", true);
}

function getStudent() {
    var studentIdJsonObj = getStudentIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(TOKEN, DB_NAME, RELATION_NAME, studentIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, BASE_URL, IRL);
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        enableStudentFields();
        $("#fullname").focus();
    } else if (resJsonObj.status === 200) {
        $("#rollno").prop("disabled", true);
        fillStudentData(resJsonObj);
        $("#update").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#fullname").focus();
    }
}

function saveStudentData() {
    var jsonStrObj = validateStudentData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(TOKEN, jsonStrObj, DB_NAME, RELATION_NAME);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, BASE_URL, IML);
    jQuery.ajaxSetup({async: true});
    alert(JSON.stringify(resJsonObj));
    resetStudentForm();
    $("#rollno").focus();
}

function updateStudentData() {
    $("#update").prop("disabled", true);
    var jsonChg = validateStudentData();
    var updateRequest = createUPDATERecordRequest(TOKEN, jsonChg, DB_NAME, RELATION_NAME, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, BASE_URL, IML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetStudentForm();
    $("#rollno").focus();
}
