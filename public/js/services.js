function todosFactory(Api){
	var api=Api.init({url:'api/todos/'});
	return{
		get:api.get,
		create:api.create,
		update:api.update
	};
}
function usersFactory(Api){
	var api=Api.init({url:'api/users/'});
	return{
		get:api.get,
		create:api.create,
		update:api.update
	};
}
function authFactory(Api){
	var api=Api.init({url:'authenticate'});
	return{
		login:api.create
	};
} 
function userService(){
	this._user=undefined;
	 this.GetCurrentUser=function(){
		if( this._user!=undefined &&  this._user!=null){
			return this._user;
		}else{
			var user=localStorage.getItem('__sonodeuser');
			if(user && user!=null && user!='undefined'){
				this._user=JSON.parse(user);
			}
		}
	 }
	 this.SetCurrentUser=function(user){
		 if(user==undefined || user==null){
			 localStorage.removeItem('__sonodeuser');
			 this._user=undefined;
			 return;
		 }
		 this._user=user;
		 localStorage.setItem('__sonodeuser',JSON.stringify(user));
	 }
}
function messageService(toaster){
	this.success=function(title,msg){
		toaster.pop({
				type: 'success',
				title: title,
				body: msg,
				showCloseButton: true,
				timeout: 600
			});
	}
	this.error=function(title,msg){
		toaster.pop({
				type: 'error',
				title: title,
				body: msg,
				showCloseButton: true,
				timeout: 600
			});
	}
	this.info=function(title,msg){
		toaster.pop({
				type: 'info',
				title: title,
				body: msg,
				showCloseButton: true,
				timeout: 600
			});
	}
}
function apiFactory($http){
	var prefix='http://localhost:8080/';
	var facto={init:function(o){
		var url=prefix+o.url;
		var fac= {
			get : function() {
				return $http.get(url);
			},
			create : function(data) {
				return $http.post(url, data);
			},
			delete : function(id) {
				return $http.delete(url);
			},
			update : function(data) {
				return $http.put(url+data._id,data);
			}
		};
		return fac;
	}
	};
	 return facto;
}

 
angular
    .module('inspinia')
	.service('UserService', userService)
	.service('Message', messageService)
	.factory('Todos', ['Api',todosFactory])
	.factory('Users', ['Api',usersFactory])
	.factory('Auth', ['Api',authFactory])
	.factory('Api', ['$http',apiFactory]);
	