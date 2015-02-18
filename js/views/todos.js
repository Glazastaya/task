/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/todos.html',
	'common'
], function ($, _, Backbone, todosTemplate, Common) {
	'use strict';

    var TodoView = Backbone.View.extend({
        tagName: 'li',
        todoTpl: _.template(todosTemplate),
        render: function () {
            this.$el.html(this.todoTpl(this.model.attributes));
            this.$el.toggleClass('completed', this.model.get('completed'));
            this.toggleVisible();

            this.$input = this.$('.edit');


            _.bindAll(this, "updateModel");

            return this;
        },

        events: {
            'mouseenter  .view': 'getDescription',
            'mouseleave .view': 'app.AppView.clearDescription',
            'click .toggle': 'togglecompleted',
            'dblclick label': 'edit',
            'click .destroy': 'clear',
            'keypress .edit': 'moveToDescription',
            //'keypress .task-description': 'updateModel'
            //'keypress .edit-description': 'updateModel'
            //'blur .edit': 'close'

        },

        getDescription: function () {
            this.$textarea.prop("disabled", true);
            this.$textarea.val(this.model.get('description'));
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'visible', this.toggleVisible);

            this.$textarea = $('.task-description');


        },

        toggleVisible: function () {
            this.$el.toggleClass('hidden', this.isHidden());
        },

        isHidden: function () {
            var isCompleted = this.model.get('completed');
            return (
                (!isCompleted && Common.TodoFilter === 'completed') || (isCompleted && Common.TodoFilter === 'active')
            );
        },

        togglecompleted: function () {
            this.model.toggle();
        },

        edit: function () {
            this.$el.addClass('editing');

        },

        close: function () {
            var value = this.$input.val().trim();
            if (value) {
                this.model.save({
                    title: value
                });
            } else {
                this.clear();
            }

            this.$el.removeClass('editing');
        },

        moveToDescription: function (e) {
            if (e.which === Common.ENTER_KEY) {
                this.$textarea.prop("disabled", false);
                this.$textarea.focus();
                this.$textarea.keypress(this.updateModel);
            }
        },

        clear: function () {
            this.model.destroy();
        },

        updateModel: function (e) {
            var value = this.$input.val().trim();
            if (e.which === ENTER_KEY) {
                if (value) {
                    this.model.save({
                        title: this.$input.val(),
                        description: this.$textarea.val()
                    });
                } else {
                    this.clear();
                }
                $('.task-description').off('keypress');
                $('#new-todo').focus();
            };
            this.$el.removeClass('editing');
        }

    });
    
    return TodoView;
});