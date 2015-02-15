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

        this.$input = this.$('.edit');
        return this;
    },

    events: {
        'mouseenter  .view': 'getDescription',
        'mouseleave .view': 'app.AppView.clearDescription',
        'click .toggle': 'togglecompleted',
        'dblclick label': 'edit',
        'click .destroy': 'clear',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close'

    },

    getDescription: function () {
        this.$textarea.prop("disabled", true);
        $('.task-description').val(this.model.get('description'));
    },

    initialize: function () {
        this.$textarea = this.$('.task-description');

        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);
        this.listenTo(this.model, 'visible', this.toggleVisible);
    },

    toggleVisible: function () {
        this.$el.toggleClass('hidden', this.isHidden());
    },

    isHidden: function () {
        var isCompleted = this.model.get('completed');
        return ( // hidden cases only
            (!isCompleted && app.TodoFilter === 'completed') || (isCompleted && app.TodoFilter === 'active')
        );
    },

    togglecompleted: function () {
        this.model.toggle();
    },

    edit: function () {
        this.$el.addClass('editing');
        this.$input.focus();
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
        if (e.which === ENTER_KEY) {
            this.close();
        }
    },

    clear: function () {
        this.model.destroy();
    }

});