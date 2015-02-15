var app = app || {};


var TodoList = Backbone.Collection.extend({

    model: app.Todo,
    
    url: '/api/tasks.json',
    
    completed: function() {
      return this.filter(function( todo ) {
        return todo.get('completed');
      });
    },
    
    
    remaining: function() {
      return this.without.apply( this, this.completed() );
    }







});


app.Todos = new TodoList();
