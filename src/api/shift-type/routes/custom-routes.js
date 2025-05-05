"use strict"

module.exports = {
    routes: [
        {
            method: "GET",
            path: '/shift-type/list/:userid',
            handler: 'custom-controller.getShiftList'
        },
        {
            method: "POST",
            path: '/shift-type/create',
            handler: 'custom-controller.createShift'
        },
        {
            method: "PUT",
            path: '/shift-type/update/:documentid',
            handler: 'custom-controller.updateShift'
        },
        
    ]
}