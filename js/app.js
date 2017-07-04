(function(){
  'use strict';

  var app = angular.module('NarrowItDownApp',[]);
  app.controller('NarrowItDownController',NarrowItDownController);
  app.service('MenuSearchService',MenuSearchService);
  app.constant('ApiBasePath','https://davids-restaurant.herokuapp.com');
  app.directive('foundItems',foundItemsDirective);

  function foundItemsDirective(){
    var ddo = {
      restrict: 'E',
      templateUrl : 'foundItems.html',
      scope : {
        foundItems : '<',
        onRemove : '&'
      },
      controller : foundItemsDirectiveController,
      controllerAs : 'fdItems',
      bindToController: true

    };
    return ddo;
  };

  function foundItemsDirectiveController(){
    var fdItems = this;
    //console.log("fdItems :",fdItems.foundItems);

  };


  NarrowItDownController.$inject=['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var  nArrowCtrl = this;
    nArrowCtrl.searchTerm='';

    nArrowCtrl.filterItemsBySearchTerm = function(){
      //console.log('searchTerm : ',nArrowCtrl.searchTerm);
      MenuSearchService.getMatchedMenuItems(nArrowCtrl.searchTerm).then(function(response){
        nArrowCtrl.foundItems = response;
      });
    };
    nArrowCtrl.dontWantThisOne = function(index){
      console.log("item : ",index);
      nArrowCtrl.foundItems.splice(index,1);
    };



  };


  MenuSearchService.$inject=['$http', 'ApiBasePath'];
  function MenuSearchService($http,ApiBasePath){
    var service = this;
    service.getMatchedMenuItems = function(searchTerm){
      return  service.getAllMenuItems().then(function(response){
        //  console.log('foundItem',response.data.menu_items);
        var menuItems = response.data.menu_items;
        var foundItems = [];
        angular.forEach(menuItems, function(item,index) {
            /*
            if(item.description.indexOf(searchTerm) != -1){
              foundItems.push(item);
            }*/
           var searchTermRegex = new RegExp(searchTerm);
           if(searchTermRegex.test(item.description)){
                foundItems.push(item);
            }
          });
          return foundItems;
      });
    };
    service.getAllMenuItems = function(){
      var response =  $http({
        method: 'GET',
        url:(ApiBasePath + '/menu_items.json')
      });
      return response;
    };
  };

})();
