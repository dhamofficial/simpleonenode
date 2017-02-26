angular
    .module('inspinia')
	.factory('Todos', ['$http',function($http) {
		var prefix='http://localhost:8080';
		return {
			get : function() {
				return $http.get(prefix+'/api/todos');
			},
			create : function(todoData) {
				return $http.post(prefix+'/api/todos', todoData);
			},
			delete : function(id) {
				return $http.delete(prefix+'/api/todos/' + id);
			},
			update : function(id,data) {
				return $http.put(prefix+'/api/todos/' + id,data);
			}
		}
	}]);