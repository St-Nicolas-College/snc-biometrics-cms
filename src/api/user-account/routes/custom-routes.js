"use strict"

module.exports = {
    routes: [
        {
            method: "GET",
            path: '/user-account/list',
            handler: 'custom-controller.getUserList'
        },
        
    ]
}