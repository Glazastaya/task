/*global define */
define([
 'underscore',
 'backbone',
 'backboneLocalstorage',
 'models/todo'
], function (_, Backbone, Store, Todo) {
    'use strict';


    var TodoList = Backbone.Collection.extend({

        model: Todo,

        localStorage: new Backbone.LocalStorage('todos-backbone'),

        completed: function () {
            return this.filter(function (todo) {
                return todo.get('completed');
            });
        },

        remaining: function () {
            return this.without.apply(this, this.completed());
        }
    });


    return new TodoList();
})