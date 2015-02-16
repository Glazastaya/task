 var app = app || {};

 // The Application
 // ---------------


 app.AppView = Backbone.View.extend({


     el: '#todoapp',

     statsTemplate: _.template($('#stats-template').html()),

     initialize: function () {
         this.allCheckbox = this.$('#toggle-all')[0];
         this.$input = this.$('#new-todo');
         this.$textarea = this.$('.task-description');
         this.$footer = this.$('#footer');
         this.$main = this.$('#main');

         this.listenTo(app.Todos, 'add', this.addOne);
         this.listenTo(app.Todos, 'reset', this.addAll);
         this.listenTo(app.Todos, 'change:completed', this.filterOne);
         this.listenTo(app.Todos, 'filter', this.filterAll);
         this.listenTo(app.Todos, 'all', this.render);
         app.Todos.fetch();
     },


     render: function () {
         var completed = app.Todos.completed().length;
         var remaining = app.Todos.remaining().length;

         if (app.Todos.length) {
             this.$main.show();
             this.$footer.show();

             this.$footer.html(this.statsTemplate({
                 completed: completed,
                 remaining: remaining
             }));

             this.$('#filters li a')
                 .removeClass('selected')
                 .filter('[href="#/' + (app.TodoFilter || '') + '"]')
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
         var view = new app.TodoView({
             model: todo
         });
         $('#todo-list').append(view.render().el);
     },

     addAll: function () {
         this.$('#todo-list').html('');
         app.Todos.each(this.addOne, this);
     },

     cleanDescription: function () {
         if (!this.$input.val().trim()) {
             this.$textarea.val('');
         }
     },

     moveToDescription: function (event) {
         if (event.which == ENTER_KEY && this.$input.val().trim()) {
             this.$textarea.prop("disabled", false);
             this.$textarea.focus();
         }
     },

     createOnEnter: function (event) {console.log('9999');
         if (event.which == ENTER_KEY && this.$input.val().trim()) {
             app.Todos.create({
                 title: this.$input.val().trim(),
                 description: this.$textarea.val().trim(),
                 completed: false,
                 data: 'Thu Jan 01 1970 03:00:00 GMT+0300',
                 id: ++app.Todos.length
             });

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
         app.Todos.each(this.filterOne, this);
     },

     clearCompleted: function () {
         _.invoke(app.Todos.completed(), 'destroy');
         return false;
     },

     // New
     toggleAllComplete: function () {
         var completed = this.allCheckbox.checked;

         app.Todos.each(function (todo) {
             todo.save({
                 'completed': completed
             });
         });
     }





 });