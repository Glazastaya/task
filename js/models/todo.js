/*global define*/
define([
 'underscore',
 'backbone'
], function (_, Backbone) {
    'use strict';

    //todo model
    var Todo = Backbone.Model.extend({
        
        // Default attributes for the todo
        defaults: {
            title: '',
            completed: false,
            description: '',
            date: 'Thu Jan 01 1970 03:00:00 GMT+0300'
        },

        // Toggle the `completed` state of this todo item.
        toggle: function () {
            this.save({
                completed: !this.get('completed')
            });
        }


    });
    
    return Todo;

});