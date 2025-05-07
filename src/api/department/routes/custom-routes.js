"use strict"

module.exports = {
    routes: [
        {
            method: "GET",
            path: '/department/list',
            handler: 'custom-controller.getDepartmentList'
        },
       
        
    ]
}