$(document).ready(function () {
    //getListItems();
    $("#tb-1").focus();
    $("#ListTitle").focus();
   
});
var sId = "";
var cId = "";
var cbVal = "false";
$(document).on('change', '.check-box', function () {
    if (this.checked) {
        sId = this.id.split("-");
        cId = sId[1];
        cbVal = "true";
        saveCheckListItem(cId);
        $("#tb-" + this.id).css("text-decoration", "line-through")
        $(".cm-" + this.id).show();
    } else {
        sId = this.id.split("-");
        cId = sId[1];
        cbVal = "false";
        saveCheckListItem(cId);       
        $("#tb-" + this.id).css("text-decoration", "none")
        $(".cm-" + this.id).hide();
    }
});
$(document).on('blur', '.cb-text', function () {
    var tbContent = $("#" + this.id).val();

    sId = this.id.split("-");
    cId = sId[1];
    saveCheckListItem(cId);
});


var i = 0;               
function addListItem() {
    var checkListId = $("#CheckListId").text();
    var count = $("#CheckListItemCount").text();
    var id = i++ + 1;
    var title = $("#ListTitle").val();
    if (title === "") {
        $(".error-msg").text("Please enter a title")
        $("#ListTitle").css("border", "solid 1px red");
        $(".error-msg").show();
    } else {
        $(".error-msg").hide();
        $("#ListTitle").css("border", "none");
        saveCheckList()
    }
    
    //var ncount = parseInt(count);
    //if (count === "") {
    //    id = i++ + 1;
    //} else {
    //    id = i++ + ncount;
    //}
   
    //$("#tb-" + id).focus();
    //var items = [];
    //items.push("<div id='list-" + id + "'>")
    //items.push("<div class='cb-left-sec'>");
    //items.push("<input class='check-box' type='checkbox' id='" + id + "' />");
    //items.push("</div>");
    //items.push("<div class='cb-right-sec'>");
    //items.push("<input class='cb-text' type='text' id='tb-" + id + "' placeholder='Enter task description' />");
    //items.push("</div>");
    //items.push("<div class='cb-remove' id='cb-remove-" + id + "'>");
    //items.push(" <a href='#' class='remove-btn' onclick='removeListItem(" + id + ")'>X</a>");
    //items.push("</div>");
    //items.push("</div>");
    //items.push("<div class='checkmark-circle cm-" + id + "'>");
    //items.push("<div class='background'></div>");
    //items.push("<div class='checkmark draw'></div>");
    //items.push("</div>");
    //items.push("<div class='clearfloat'></div>");

    //$("<div/>", {
    //    "class": "new-list",
    //    html: items.join("")
    //}).appendTo(".list-container");
}

function removeListItem(data) {
    //decrement one when list item removed
    i--;
    var id = data;
    $("#list-" + id).hide();
    $(".cm-" + id).hide();
}

function getListItems(data) {
    $("#CheckListId").text(data);
    var uri = 'api/CheckList/GetListItems';
    var id = data;
    $.getJSON(uri + '/' + id)
               .done(function (data) {
                   var items = [];
                   $.each(data, function (key, item) {
                       $("#ListTitle").val(item.Title);
                       var desc = item.Description;
                       if (desc === null) {
                           desc = "";
                       }
                       items.push("<div id='list-" + item.Id + "' class='list-m-sec'>")
                       items.push("<div class='cb-left-sec'>");
                       if (item.IsComplete === true) {
                           items.push("<input class='check-box' type='checkbox' id='cb-" + item.Id + "' checked/>");
                       } else {
                           items.push("<input class='check-box' type='checkbox' id='cb-" + item.Id + "' />");
                       }
                       
                       items.push("</div>");
                       items.push("<div class='cb-right-sec'>");
                       if (item.IsComplete === true) {
                           items.push("<input class='cb-text' type='text' id='tb-" + item.Id + "' placeholder='Enter task description' value='" + desc + "' style='text-decoration: line-through'/>");
                       } else {
                           items.push("<input class='cb-text' type='text' id='tb-" + item.Id + "' placeholder='Enter task description' value='" + desc + "' style='text-decoration:none;' />");
                       }               
                       items.push("</div>");
                       items.push("<div class='cb-remove' id='cb-remove-" + item.Id + "'>");
                       items.push(" <a href='#' class='remove-btn' onclick='removeListItem(" + item.Id + ")'>X</a>");
                       items.push("</div>");
                       items.push("</div>");
                       if (item.IsComplete === true) {
                           items.push("<div class='checkmark-circle cm-" + item.Id + "' style='display:block;'>");
                           items.push("<div class='background'></div>");
                           items.push("<div class='checkmark draw'></div>");
                           items.push("</div>");
                       } else {
                           items.push("<div class='checkmark-circle cm-" + item.Id + "' style='display:none;'>");
                           items.push("<div class='background'></div>");
                           items.push("<div class='checkmark draw'></div>");
                           items.push("</div>");
                       }
                       
                       items.push("<div class='clearfloat'></div>");
                       

                   });

                   $("<div/>", {
                       "class": "new-list",
                       html: items.join("")
                   }).appendTo(".list-container");
                   $("#CheckListItemCount").text(data.length);
                   $("#my-lists-page").hide();
                   $("#login-page").hide();
                   $("#list-page").show();

               })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == "500") {
                    console.log("Error: No list found", textStatus, errorThrown)
                } else if (jqXHR.status == "400") {
                    console.log("Error: invalid model in request, required parameters missing or malformed")
                } else {
                    console.log("Error: Unexpected error from server")
                }
            });
}

function getMyLists(data) {
    $("#LoginId").text(data);
    var uri = 'api/CheckList/GetMyLists';
    var id = data;
    $.getJSON(uri + '/' + id)
               .done(function (data) {
                   if (data.length > 0) {
                       var items = [];
                       $(".no-content").hide();
                       $.each(data, function (key, item) {

                           items.push("<div id='ml-" + item.Id + "'>")
                           items.push("<a href='#' class='my-lists' onclick='getListItems(" + item.Id + ")'>" + item.Name + "</a>")
                           items.push("<a href='#' class='delete-list' onclick='deleteList(" + item.Id + ")'>Delete</a>")
                           items.push("<div class='clearfloat'></div>")
                           items.push("</div>")
                       });

                       $("<div/>", {
                           "class": "my-current-list",
                           html: items.join("")
                       }).appendTo(".my-lists-container");
                   } else {
                       $(".no-content").show();
                   }
                   
                   
                   $("#login-page").hide();
                   $("#my-lists-page").show();
                   

               })
            .fail(function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == "500") {
                    console.log("Error: No list found", textStatus, errorThrown)
                } else if (jqXHR.status == "400") {
                    console.log("Error: invalid model in request, required parameters missing or malformed")
                } else if (jqXHR.status == "404") {
                    console.log("Error: not found")
                } else {
                    console.log("Error: Unexpected error from server")
                }
            });
}

function addCheckList() {
    $("#CheckListId").text("0");
    $("#my-lists-page").hide();
    $("#login-page").hide();
    $("#list-page").show();
}

function saveCheckList() {
    var checkListId = $("#CheckListId").text();
    var loginId = $("#LoginId").text();
    var title = $("#ListTitle").val();
    var isActive = true;
    var uri = "api/CheckList/SaveCheckList";

    $.post(uri, { Id: checkListId, LoginId: loginId, Name: title, IsActive: isActive })
            .done(function (data) {
                $("#tb-" + data.Id).focus();
                $("#CheckListId").text(data.CheckListId);
                var items = [];
                items.push("<div id='list-" + data.Id + "'>")
                items.push("<div class='cb-left-sec'>");
                items.push("<input class='check-box' type='checkbox' id='cb-" + data.Id + "' />");
                items.push("</div>");
                items.push("<div class='cb-right-sec'>");
                items.push("<input class='cb-text' type='text' id='tb-" + data.Id + "' placeholder='Enter task description' />");
                items.push("</div>");
                items.push("<div class='cb-remove' id='cb-remove-" + data.Id + "'>");
                items.push(" <a href='#' class='remove-btn' onclick='removeListItem(" + data.Id + ")'>X</a>");
                items.push("</div>");
                items.push("</div>");
                items.push("<div class='checkmark-circle cm-" + data.Id + "'>");
                items.push("<div class='background'></div>");
                items.push("<div class='checkmark draw'></div>");
                items.push("</div>");
                items.push("<div class='clearfloat'></div>");

                $("<div/>", {
                    "class": "new-list",
                    html: items.join("")
                }).appendTo(".list-container");
            })
          .fail(function (jqXHR, textStatus, errorThrown) {
              if (jqXHR.status == "500") {
                  console.log("Error: No list found", textStatus, errorThrown)
              } else if (jqXHR.status == "400") {
                  console.log("Error: invalid model in request, required parameters missing or malformed")
              } else if (jqXHR.status == "404") {
                  console.log("Error: not found")
              } else {
                  console.log("Error: Unexpected error from server")
              }
          });
}

function saveCheckListItem(data) {
    var id = data;
    var checkListId = $("#CheckListId").text();
    var checkListItemId = id;
    var loginId = $("#LoginId").text();
    var desc = $("#tb-" + id).val();
    var isComplete = cbVal;
  
    var uri = "api/CheckList/SaveCheckListItem";
    $.post(uri, { Id: checkListItemId, Description: desc, IsComplete: isComplete })
            .done(function (data) {
                //$("#tb-" + data.Id).focus();
                if (data.IsComplete === true) {
                    $("#tb-" + data.Id).css("text-decoration", "line-through")
                    $(".cm-" + data.Id).show();
                } else {
                    $("#tb-" + data.Id).css("text-decoration", "none")
                    $(".cm-" + data.Id).hide();
                }
            })
          .fail(function (jqXHR, textStatus, errorThrown) {
              if (jqXHR.status == "500") {
                  console.log("Error: No list found", textStatus, errorThrown)
              } else if (jqXHR.status == "400") {
                  console.log("Error: invalid model in request, required parameters missing or malformed")
              } else if (jqXHR.status == "404") {
                  console.log("Error: not found")
              } else {
                  console.log("Error: Unexpected error from server")
              }
          });
}

function deleteList(data) {
    var id = data;
    

    var uri = "api/CheckList/DeleteCheckList";
    $.post(uri, {Id: id})
            .done(function (data) {
                $("#ml-" + id).hide();
            })
          .fail(function (jqXHR, textStatus, errorThrown) {
              if (jqXHR.status == "500") {
                  console.log("Error: No list found", textStatus, errorThrown)
              } else if (jqXHR.status == "400") {
                  console.log("Error: invalid model in request, required parameters missing or malformed")
              } else if (jqXHR.status == "404") {
                  console.log("Error: not found")
              } else {
                  console.log("Error: Unexpected error from server")
              }
          });
}