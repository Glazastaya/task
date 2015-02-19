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

    //Our overall **AppView** is the top-level piece of UI 
    var AppView = Backbone.View.extend({

        // Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
        el: '#todoapp',
        
        // Compile stats template
        statsTemplate: _.template(statsTemplate),
        
        // At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
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

        // Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
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
        
        // Delegated events for creating new items, and clearing completed ones.
        events: {
            'focus  #new-todo': 'cleanDescription',
            'click  #new-todo': 'cleanDescription',
            'keypress  #new-todo': 'moveToDescription',
            'keypress  .task-description': 'createOnEnter',
            'click #clear-completed': 'clearCompleted',
            'click #toggle-all': 'toggleAllComplete'
        },
        
        // Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
        addOne: function (todo) {
            var view = new TodoView({
                model: todo
            });
            $('#todo-list').append(view.render().el);
        },
        
        // Add all items in the **Todos** collection at once.
        addAll: function () {
            this.$('#todo-list').html('');
            Todos.each(this.addOne, this);
        },

        // clean description value
        cleanDescription: function () {
            if (!this.$input.val().trim()) {
                this.$textarea.val('');
            }
        },

        //unlock and give focus on textarea for input description
        moveToDescription: function (event) {
            if (event.which == Common.ENTER_KEY && this.$input.val().trim()) {
                this.$textarea.prop("disabled", false);
                this.$textarea.focus();
            }
        },
        
        //create new model in TodosCollection if pressed "enter" key and prepare create a new item
        createOnEnter: function (event) {
            if (event.which == Common.ENTER_KEY && this.$input.val().trim()) {
                Todos.create({
                    title: this.$input.val().trim(),
                    description: this.$textarea.val().trim(),
                    date: 'Thu Jan 01 1970 03:00:00 GMT+0300'
                });

                this.$textarea.prop("disabled", true);
                this.$input.val('');
                this.$input.focus();
            }


        },
        
        //trigger custom event 'visible' for further filtering
        filterOne: function (todo) {
            todo.trigger('visible');
        },

        //trigger for each element on TodosCollection custom event 'visible' for further filtering
        filterAll: function () {
            Todos.each(this.filterOne, this);
        },

        //remove all models with status 'completed: true'
        clearCompleted: function () {
            _.invoke(Todos.completed(), 'destroy');
            return false;
        },

        // toggle all models either completed or not
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