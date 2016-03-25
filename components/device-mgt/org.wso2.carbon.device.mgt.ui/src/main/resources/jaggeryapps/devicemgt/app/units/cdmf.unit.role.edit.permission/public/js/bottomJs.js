/*
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Checks if provided input is valid against RegEx input.
 *
 * @param regExp Regular expression
 * @param inputString Input string to check
 * @returns {boolean} Returns true if input matches RegEx
 */

/**
 * Tree view function
 * @return {Null}
 */
var modalPopup = ".wr-modalpopup";
var modalPopupContent = modalPopup + " .modalpopup-content";

/*
 * hide popup function.
 */
function hidePopup() {
    $(modalPopupContent).html('');
    $(modalPopup).hide();
}

/*
 * show popup function.
 */
function showPopup() {
    $(modalPopup).show();
    setPopupMaxHeight();
}
$.fn.tree_view = function(){
    var tree = $(this);
    tree.find('li').has("ul").each(function () {
        var branch = $(this); //li with children ul
        branch.prepend('<i class="icon"></i>');
        branch.addClass('branch');
        branch.on('click', function (e) {
            if (this == e.target) {
                var icon = $(this).children('i:first');
                icon.closest('li').toggleAttr('aria-expanded', 'true', 'false');
            }
        });
    });

    tree.find('.branch .icon').each(function(){
        $(this).on('click', function () {
            $(this).closest('li').click();
        });
    });

    tree.find('.branch > a').each(function () {
        $(this).on('click', function (e) {
            $(this).closest('li').click();
            e.preventDefault();
        });
    });

    tree.find('.branch > button').each(function () {
        $(this).on('click', function (e) {
            $(this).closest('li').click();
            e.preventDefault();
        });
    });
};

$.fn.toggleAttr = function (attr, val, val2) {
    return this.each(function () {
        var self = $(this);
        if (self.attr(attr) == val) self.attr(attr, val2); else self.attr(attr, val);
    });
};
$(document).ready(function () {
    var listPartialSrc = $("#list-partial").attr("src");
    var treeTemplateSrc = $("#tree-template").attr("src");
    var roleName = $("#permissionList").data("currentrole");
    var serviceUrl = "/devicemgt_admin/roles/permissions?rolename=" + encodeURIComponent(roleName);
    $.registerPartial("list", listPartialSrc, function(){
        $.template("treeTemplate", treeTemplateSrc, function (template) {
            invokerUtil.get(serviceUrl,
                function(data){
                    data = JSON.parse(data);
                    var treeData = data.responseContent;
                    if(treeData.nodeList.length > 0){
                        treeData = { nodeList: treeData.nodeList };
                        var content = template(treeData);
                        $("#permissionList").html(content);
                        $("#permissionList").on("click", ".permissionTree .permissionItem", function() {
                            var parentValue = $(this).prop('checked');
                            $(this).closest("li").find("li input").each(function () {
                                $(this).prop('checked',parentValue);
                            });
                        });
                    }
                    $("#permissionList li input").click(function() {
                        var parentInput = $(this).parents("ul:eq(1) > li").find('input:eq(0)');
                        if(parentInput && parentInput.is(':checked')){
                            $(modalPopupContent).html($('#child-deselect-error-content').html());
                            showPopup();
                            $("a#child-deselect-error-link").click(function () {
                                hidePopup();
                            });
                            return false;
                        }
                    });
                    $('#permissionList').tree_view();
                }, function(message){
                    console.log(message);
                });
        });
    });

    /**
     * Following click function would execute
     * when a user clicks on "Add Role" button
     * on Add Role page in WSO2 MDM Console.
     */
    $("button#update-permissions-btn").click(function() {
        var roleName = $("#permissionList").data("currentrole");
        var updateRolePermissionAPI = "/devicemgt_admin/roles?rolename=" + roleName;
        var updateRolePermissionData = {};
        var perms = [];
        $("#permissionList li input:checked").each(function(){
            perms.push($(this).data("resourcepath"));
        });
        updateRolePermissionData.permissions = perms;
        invokerUtil.put(
            updateRolePermissionAPI,
            updateRolePermissionData,
            function (jqXHR) {
                if (JSON.parse(jqXHR).statusCode == 200 || jqXHR.status == 200) {
                    // Refreshing with success message
                    $("#role-create-form").addClass("hidden");
                    $("#role-created-msg").removeClass("hidden");
                }
            }, function (data) {
                $(errorMsg).text(JSON.parse(data.responseText).errorMessage);
                $(errorMsgWrapper).removeClass("hidden");
            }
        );
    });
});