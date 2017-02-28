/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider,$httpProvider) {
    $urlRouterProvider.otherwise("/index/main");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "views/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "views/main.html",
            data: { pageTitle: 'dashboard' }
        })
        .state('index.createuser', {
            url: "/createuser",
            controller:'userCtrl',
            templateUrl: "views/user.edit.html",
            data: { pageTitle: 'create user' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('index.login', {
            url: "/login",
            controller:'loginCtrl',
            templateUrl: "views/user.login.html",
            data: { pageTitle: 'login' }
        })
        .state('login', {
            url: "/login",
            controller:'loginCtrl',
            templateUrl: "views/user.login.html",
            data: { pageTitle: 'login' }
        })
        .state('index.todo', {
            url: "/todo",
            controller:'todoCtrl',
            templateUrl: "views/todo.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ui.sortable',
                            files: ['js/plugins/ui-sortable/sortable.js']
                        }
                    ]);
                }
            },
            data: { pageTitle: 'todo' }
        });


    var interceptor = function (UserService, $q, $location) {
        return {
            request: function (config) {
                var currentUser = UserService.GetCurrentUser();
                if (currentUser != null) {
                    config.headers['x-access-token'] = currentUser.token;
                }
                return config;
            },
            responseError: function (rejection) {
                if (rejection.status === 401) {
                    // console.log('status:401');
                    $location.path('/login');
                    return $q.reject(rejection);
                }
                if (rejection.status === 403) {
                    // console.log('status:403');
                    $location.path('/login');
                    return $q.reject(rejection);
                }
                return $q.reject(rejection);
            }
        }
    }
    interceptor.$inject = ['UserService', '$q', '$location'];
    $httpProvider.interceptors.push(interceptor)
}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
