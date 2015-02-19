/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/todos.html',
	'common'
], function ($, _, Backbone, todosTemplate, Common) {
	'use strict';
    
    //individual view for model
    var TodoView = Backbone.View.extend({
        
        //create '<li></li>'        
        tagName: 'li',
        
        //Compile item template
        todoTpl: _.template(todosTemplate),
        
        // rendering item view
        render: function () {
            this.$el.html(this.todoTpl(this.model.attributes));
            this.$el.toggleClass('completed', this.model.get('completed'));
            this.toggleVisible();
            this.$input = this.$('.edit');
            _.bindAll(this, "updateModel");
            return this;
        },

        // Delegated events for display description, toggle completed, remove item, edit item.
        events: {
            'mouseenter  .view': 'getDescription',
            'mouseleave .view': 'app.AppView.clearDescription',
            'click .toggle': 'togglecompleted',
            'dblclick label': 'edit',
            'click .destroy': 'clear',
            'keypress .edit': 'moveToDescription',
        },

        //display description 
        getDescription: function () {
            this.$textarea.prop("disabled", true);
            this.$textarea.val(this.model.get('description'));
        },

        //initialization and bind to the relevant events on the `todo` model change condition,        
		//destroy and toggle visibility
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'visible', this.toggleVisible);
            this.$textarea = $('.task-description');
        },

        //toggle visibility according to the filter
        toggleVisible: function () {
            this.$el.toggleClass('hidden', this.isHidden());
        },

        //rules for the filter
        isHidden: function () {
            var isCompleted = this.model.get('completed');
            return (
                (!isCompleted && Common.TodoFilter === 'completed') || (isCompleted && Common.TodoFilter === 'active')
            );
        },

        //toggle of value "completed" 
        togglecompleted: function () {
            this.model.toggle();
        },

        //add class "editing"
        edit: function () {
            this.$el.addClass('editing');

        },
        
        //unlock and give focus on textarea for input description
        moveToDescription: function (e) {
            if (e.which === Common.ENTER_KEY) {
                this.$textarea.prop("disabled", false);
                this.$textarea.focus();
                this.$textarea.keypress(this.updateModel);
            }
        },

        //remove todo model
        clear: function () {
            this.model.destroy();
        },

        //edit todo model
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