var App = angular.module('App', []);

App.controller("PageController"), function($scope) {
	var allelements = $('#keyline *');
	console.log(allelements);
}

App.directive('ngList', function() {
	return {
		restrict: 'A',
		scope: { 'el-data': '='},
		template: 'directives/list.html'
	}
});
