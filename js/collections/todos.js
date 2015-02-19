/*global define */
define([
 'underscore',
 'backbone',
 'backboneLocalstorage',
 'models/todo'
], function (_, Backbone, Store, Todo) {
    'use strict';

    //Collection of todo model
    var TodoList = Backbone.Collection.extend({

        model: Todo,

        // Save all of the todo items under the `"todos"` namespace.
        localStorage: new Backbone.LocalStorage('todos-backbone'),

        // Filter down the list of all todo items that are finished.
        completed: function () {
            return this.filter(function (todo) {
                return todo.get('completed');
            });
        },

        // Filter down the list to only todo items that are still not finished.
        remaining: function () {
            return this.without.apply(this, this.completed());
        }
    });


    return new TodoList();
})