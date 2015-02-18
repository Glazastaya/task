/*global define*/
define([
 'underscore',
 'backbone'
], function (_, Backbone) {
    'use strict';

    var Todo = Backbone.Model.extend({
        defaults: {
            title: '',
            completed: false,
            description: '',
            date: 'Thu Jan 01 1970 03:00:00 GMT+0300'
        },

        toggle: function () {
            this.save({
                completed: !this.get('completed')
            });
        }


    });
    
    return Todo;

});