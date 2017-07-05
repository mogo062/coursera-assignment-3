(function(){
  'use strict';

  var app = angular.module('NarrowItDownApp',[]);
  app.controller('NarrowItDownController',NarrowItDownController);
  app.service('MenuSearchService',MenuSearchService);
  app.constant('ApiBasePath','https://davids-restaurant.herokuapp.com');
  app.directive('foundItems',foundItemsDirective);
  //app.directive('mgLoader',mgLoaderDirective);


/*
  function mgLoaderDirective(){
    var ddo = {
      restrict : 'E',
      templateUrl : 'directives/loader/itemsloaderindicator.template.html',
      scope : {
        mgItems : '<'
      },
      controller : mgLoaderDirectiveController,
      controllerAs : 'mgLoader',
      bindToController: true,
      link : mgLoaderDirectivelink

    };
    return ddo;
  };
  function mgLoaderDirectivelink (scope, element, attrs, controller){
    console.log("Link scope is: ", scope);
    console.log("Controller instance is: ", controller);
    console.log("Element is: ", element);
    scope.$watch('mgLoader.mgItems', function (newValue, oldValue) {
      console.log("Old value: ", oldValue);
      console.log("New value: ", newValue);
      if(newValue != oldValue){
        activateLoader();
      }else{
        disableLoader();
      }
    });

    function activateLoader(){
      var loaderElem = element.find("div.loader");
      loaderElem.css('display', 'block');
    };
    function disableLoader(){
      var loaderElem = element.find("div.loader");
      loaderElem.css('display', 'none');
    };
  };
  function mgLoaderDirectiveController(){
    var mgLoader = this;

  };
*/
  function foundItemsDirective(){
    var ddo = {
      restrict : 'E',
      templateUrl : 'directives/foundItems/foundItems.html',
      scope : {
        foundItems : '<',
        mgLoader : '<',
        onRemove : '&'
      },
      controller : foundItemsDirectiveController,
      controllerAs : 'fdItems',
      bindToController: true,
      link : foundItemsDirectivelink,
      transclude : true
    };
    return ddo;
  };

  function foundItemsDirectivelink(scope, element, attrs, controller){
    console.log("Link scope is: ", scope);
    console.log("Controller instance is: ", controller);
    console.log("Element is: ", element);
    scope.$watch('fdItems.mgLoader', function (newValue, oldValue) {
      console.log("Old value: ", oldValue);
      console.log("New value: ", newValue);
      if(newValue){
        activateLoader();
      }else{
        disableLoader()
      }
    });
    function activateLoader(){
      var loaderElem = element.find("div.loader");
      console.log('loaderElem : ',loaderElem);
      loaderElem.css('display', 'block');
    };
    function disableLoader(){
      var loaderElem = element.find("div.loader");
      loaderElem.css('display', 'none');
    };
  };

  function foundItemsDirectiveController(){
    var fdItems = this;
    fdItems.mgLoader = false;
  //  console.log("fdItems directive :",fdItems.foundItems);

  };

  NarrowItDownController.$inject=['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var  nArrowCtrl = this;
    nArrowCtrl.searchTerm='';
  //  nArrowCtrl.mgLoader = true;

    nArrowCtrl.filterItemsBySearchTerm = function(){
      nArrowCtrl.mgLoader = true;
      MenuSearchService.getMatchedMenuItems(nArrowCtrl.searchTerm).then(function(response){
        nArrowCtrl.foundItems = response;
        nArrowCtrl.mgLoader = false;
      });
    };
    nArrowCtrl.dontWantThisOne = function(index){
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
