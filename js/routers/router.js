/*global define*/
define([
 'jquery',
 'backbone',
 'collections/todos',
 'common'
], function ($, Backbone, Todos, Common) {
    'use strict';
    
    
    //routing
    var TodoRouter = Backbone.Router.extend({
        routes: {
            '*filter': 'setFilter'
        },

        setFilter: function (param) {
            // Set the current filter to be used
            if (param) {
                param = param.trim();
            }
            Common.TodoFilter = param || '';

            // Trigger a collection filter event, causing hiding/unhiding
            // of Todo view items
            Todos.trigger('filter');
        }
    });

    
    return TodoRouter;


});