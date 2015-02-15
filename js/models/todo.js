var app = app || {};

// Todo Model
// ----------


app.Todo = Backbone.Model.extend({
    defaults: {
        title: '',
        completed: false,
        description: '',
        data: ''
    },

    toggle: function () {
        this.save({
            completed: !this.get('completed')
        });
    }


});


/*console.log(JSON.stringify(todo1));*/