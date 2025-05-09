"use strict"

module.exports = {
    routes: [
        {
            method: "GET",
            path: '/user-account/list',
            handler: 'custom-controller.getUserList'
        },
        {
            method: "GET",
            path: '/user-account/:userid',
            handler: 'custom-controller.getUserDetails'
        },
        {
            method:"PUT",
            path: '/user-account/update/:userid',
            handler: 'custom-controller.updateUserDetails'
        }
        
    ]
}