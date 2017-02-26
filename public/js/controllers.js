/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl() {

    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';

};

function todoCtrl($scope, $http,Todos){
    $scope.formData = {};
    $scope.loading = true;

    // GET =====================================================================
    // when landing on the page, get all todos and show them
    // use the service to get all the todos
    Todos.get()
        .success(function(data) {
            $scope.todos = data;
            //console.log('fetching::',data);
            $scope.loading = false;
        });

    // CREATE ==================================================================
    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {

        // validate the formData to make sure that something is there
        // if form is empty, nothing will happen
        if ($scope.formData.text != undefined) {
            $scope.loading = true;

            // call the create function from our service (returns a promise object)
            Todos.create($scope.formData)

                // if successful creation, call our get function to get all the new todos
                .success(function(data) {
                    $scope.loading = false;
                    $scope.formData = {}; // clear the form so our user is ready to enter another
                    $scope.todos = data; // assign our new list of todos
                });
        }
    };

    // DELETE ==================================================================
    // delete a todo after checking it
    $scope.deleteTodo = function(id) {
        $scope.loading = true;

        Todos.delete(id)
            // if successful creation, call our get function to get all the new todos
            .success(function(data) {
                $scope.loading = false;
                $scope.todos = data; // assign our new list of todos
            });
    };
    $scope.mark = function(task,status) {
        $scope.loading = true;
        task.status=status;
        Todos.update(task._id,task)
            // if successful creation, call our get function to get all the new todos
            .success(function(data) {
                $scope.loading = false;
                $scope.todos = data; // assign our new list of todos
            });
    };
    
    
    $scope.todoList = [];
    $scope.inProgressList = [];
    $scope.completedList = [];
    var statusText='';
    $scope.sortableOptions = {
        connectWith: ".connectList",
        receive: function(event, ui) {
            var sourceList = ui.sender;
            var targetList = $(this);
            var targetNew=$(targetList[0]).hasClass('new-tasks');
            var targetInprogress=$(targetList[0]).hasClass('inprogress-tasks');
            var targetCompleted=$(targetList[0]).hasClass('completed-tasks');
            //console.log(targetNew,targetInprogress,targetCompleted);
            statusText=targetNew?'New':targetInprogress?'In-Progress':targetCompleted?'Completed':'New';
        },
        update: function(e, ui) {
            if (ui.item.sortable.model == "can't be moved") {
            ui.item.sortable.cancel();
        }
    },
    stop:function(e, ui){
        var _id=ui.item[0].id;
        $scope.mark({_id:_id},statusText);
    }
    };
    
    
}


angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)
    .controller('todoCtrl', todoCtrl)