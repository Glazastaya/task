/*global define*/
define([
 'jquery',
 'underscore',
 'backbone',
 'collections/todos',
 'views/todos',
 'text!templates/stats.html',
 'common'
], function ($, _, Backbone, Todos, TodoView, statsTemplate, Common) {
    'use strict';


    var AppView = Backbone.View.extend({


        el: '#todoapp',

        statsTemplate: _.template(statsTemplate),

        initialize: function () {
            this.allCheckbox = this.$('#toggle-all')[0];
            this.$input = this.$('#new-todo');
            this.$textarea = this.$('.task-description');
            this.$footer = this.$('#footer');
            this.$main = this.$('#main');

            this.listenTo(Todos, 'add', this.addOne);
            this.listenTo(Todos, 'reset', this.addAll);
            this.listenTo(Todos, 'change:completed', this.filterOne);
            this.listenTo(Todos, 'filter', this.filterAll);
            this.listenTo(Todos, 'all', this.render);
            Todos.fetch();
        },


        render: function () {
            var completed = Todos.completed().length;
            var remaining = Todos.remaining().length;

            if (Todos.length) {
                this.$main.show();
                this.$footer.show();

                this.$footer.html(this.statsTemplate({
                    completed: completed,
                    remaining: remaining
                }));

                this.$('#filters li a')
                    .removeClass('selected')
                    .filter('[href="#/' + (Common.TodoFilter || '') + '"]')
                    .addClass('selected');
            } else {
                this.$main.hide();
                this.$footer.hide();
            }

            this.allCheckbox.checked = !remaining;
            return this;
        },

        events: {
            'focus  #new-todo': 'cleanDescription',
            'click  #new-todo': 'cleanDescription',
            'keypress  #new-todo': 'moveToDescription',
            'keypress  .task-description': 'createOnEnter',
            'click #clear-completed': 'clearCompleted',
            'click #toggle-all': 'toggleAllComplete'
        },

        addOne: function (todo) {
            var view = new TodoView({
                model: todo
            });
            $('#todo-list').append(view.render().el);
        },

        addAll: function () {
            this.$('#todo-list').html('');
            Todos.each(this.addOne, this);
        },

        cleanDescription: function () {
            if (!this.$input.val().trim()) {
                this.$textarea.val('');
            }
        },

        moveToDescription: function (event) {
            if (event.which == Common.ENTER_KEY && this.$input.val().trim()) {
                this.$textarea.prop("disabled", false);
                this.$textarea.focus();
            }
        },

        createOnEnter: function (event) {
            if (event.which == Common.ENTER_KEY && this.$input.val().trim()) {
                Todos.create({
                    title: this.$input.val().trim(),
                    description: this.$textarea.val().trim(),
                    date: 'Thu Jan 01 1970 03:00:00 GMT+0300'
                });
                console.log(Todos.toJSON());

                this.$textarea.prop("disabled", true);
                this.$input.val('');
                this.$input.focus();
            }


        },

        filterOne: function (todo) {
            todo.trigger('visible');
        },

        // New
        filterAll: function () {
            Todos.each(this.filterOne, this);
        },

        clearCompleted: function () {
            _.invoke(Todos.completed(), 'destroy');
            return false;
        },

        // New
        toggleAllComplete: function () {
            var completed = this.allCheckbox.checked;

            Todos.each(function (todo) {
                todo.save({
                    'completed': completed
                });
            });
        }

    });
    return AppView;
});