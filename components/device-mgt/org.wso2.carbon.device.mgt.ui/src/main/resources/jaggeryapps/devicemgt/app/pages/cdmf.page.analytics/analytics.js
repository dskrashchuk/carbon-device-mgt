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

function onRequest(context) {
    var groupName = request.getParameter("groupName");
    var groupId = request.getParameter("groupId");
    var deviceName = request.getParameter("deviceName");
    var deviceId = request.getParameter("deviceId");
    var deviceType = request.getParameter("deviceType");
    var title = "Analytics";
    if (groupName) {
        title = "Group " + title;
    } else {
        title = "Device " + title;
    }
    return {
        "title": title,
        "groupName": groupName,
        "groupId": groupId,
        "deviceName": deviceName,
        "deviceId": deviceId,
        "deviceType": deviceType
    };
}