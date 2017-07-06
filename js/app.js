(function(){
  'use strict';

  var app = angular.module('NarrowItDownApp',[]);
  app.controller('NarrowItDownController',NarrowItDownController);
  app.service('MenuSearchService',MenuSearchService);
  app.constant('ApiBasePath','https://davids-restaurant.herokuapp.com');
  app.directive('foundItems',foundItemsDirective);
  app.directive('mgLoader',mgLoaderDirective);

  function mgLoaderDirective(){
    var ddo = {
      restrict : 'E',
      templateUrl : 'directives/loader/itemsloaderindicator.template.html',
      scope : {
        mgLoader : '<'
      },
      controller : mgLoaderDirectiveController,
      controllerAs : 'mgLoader',
      bindToController: true,
      link : mgLoaderDirectivelink
    };
    return ddo;
  };
  function mgLoaderDirectivelink (scope, element, attrs, controller){
    scope.$watch('mgLoader.mgLoader', function (newValue, oldValue) {
      if(newValue){
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
    mgLoader.mgLoader = false;
  };

  function foundItemsDirective(){
    var ddo = {
      restrict : 'E',
      templateUrl : 'directives/foundItems/foundItems.html',
      scope : {
        foundItems : '<',
        tbHeader : '<',
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

  };

  function foundItemsDirectiveController(){
    var fdItems = this;
  };

  NarrowItDownController.$inject=['MenuSearchService'];
  function NarrowItDownController(MenuSearchService){
    var  nArrowCtrl = this;
    nArrowCtrl.searchTerm='';
    nArrowCtrl.tbheader=[
      {
        name : 'full name',
        class : 'fixedWdith-35'
      },{
        name : 'description',
        class : 'fixedWdith-35'
      },{
        name : 'short name'
      },{
        
      }
    ];
    //console.log("tbHeader : ",nArrowCtrl.tbheader);
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
           var searchTermRegex = new RegExp(searchTerm.toUpperCase());
           if(searchTermRegex.test(item.description.toUpperCase())){
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
