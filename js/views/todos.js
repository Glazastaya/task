var app = app || {};

// Todo Item View
// --------------


app.TodoView = Backbone.View.extend({
    tagName: 'li',
    todoTpl: _.template($('#item-template').html()),
    render: function () {
        this.$el.html(this.todoTpl(this.model.attributes));
        this.$el.toggleClass('completed', this.model.get('completed'));
        this.toggleVisible();

        this.$editTextarea = this.$('.edit-description');
        this.$input = this.$('.edit');
        this.$textarea = $('.task-description');

        this.$editTextarea.hide();
        return this;
    },

    events: {
        'mouseenter  .view': 'getDescription',
        'mouseleave .view': 'app.AppView.clearDescription',
        'click .toggle': 'togglecompleted',
        'dblclick label': 'edit',
        'click .destroy': 'clear',
        'keypress .edit': 'updateOnEnter',
        'keypress .edit-description': 'updateModel'
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
    },

    toggleVisible: function () {
        this.$el.toggleClass('hidden', this.isHidden());
        console.log(this.$input);
    },

    isHidden: function () {
        var isCompleted = this.model.get('completed');
        return ( 
            (!isCompleted && app.TodoFilter === 'completed') || (isCompleted && app.TodoFilter === 'active')
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

    updateOnEnter: function (e) {
        this.$textarea.hide();
        if (e.which === ENTER_KEY) {
            this.$textarea.off('keypress', app.AppView.createOnEnter);
            this.$editTextarea.show();
            this.$editTextarea.focus();
            
        }
    },

    clear: function () {
        this.model.destroy();
    },

    updateModel: function (e) {
        var value = this.$input.val().trim();
        if (e.which === ENTER_KEY) {
            console.log(value);
            if (value) {
                console.log(this.$el);
                this.model.save({
                    title: this.$input.val(),
                    description: this.$editTextarea.html()
                });
            } else {
                this.clear();
            }
            this.$textarea.show();
            $('#new-todo').focus();
        };
        this.$el.removeClass('editing');


    }

});