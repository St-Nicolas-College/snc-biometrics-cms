"use strict"

module.exports = {
    routes: [
        {
            method: "GET",
            path: '/attendance-log/list',
            handler: 'custom-controller.getAttendanceLogs'
        },
        {
            method: "GET",
            path: '/attendance-log/user/:userid',
            handler: 'custom-controller.getUserAtttendance'
        },
        
    ]
}