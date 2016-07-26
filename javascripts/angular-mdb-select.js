//angular mdb select v 1.0.2
var angularMdbSelect = angular.module("angularMdbSelect", []);

angularMdbSelect.filter("to_trusted", ["$sce", function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

angularMdbSelect.directive("mdbSelect", ["$filter", function ($filter) {
    return {
        restric: "E",
        require: "^ngModel",
        template: "<div ng-mouseleave=\"change = false\" ng-click=\"multiple ? change = true:change = !change\" ng-class=\"{'open': change}\" class=\"mdb-select\">" +
            "<label ng-bind-html=\"label | to_trusted\"></label>" +
            "<div ng-show=\"bind === undefined && multiBind === undefined\" class=\"active\" ng-bind=\"'undefined'\"></div>" +
            "<div ng-hide=\"bind === undefined && multiBind === undefined\" class=\"active\">{{activeOption}} <small>{{languages[lang].multiple}}</small></div>" +
                "<ul ng-hide=\"bind === undefined && multiBind === undefined\">" +
                    "<li ng-if=\"multiple === undefined\" ng-repeat=\"item in list\" ng-click=\"select(item)\" ng-hide=\"selected === item\">" +
                        "<span ng-if=\"multiBind === undefined\" ng-bind=\"item[bind]\"></span>" +
                        "<span ng-if=\"multiBind !== undefined\" ng-repeat=\"toBind in multiBind\" ng-bind=\"' ' + item[toBind]\"></span>" +
                    "</li>" +
                    "<li ng-if=\"multiple\" ng-repeat=\"item in list\" ng-class=\"{'active':item.set}\" ng-click=\"multipleSelect(item)\">" +
                        "<span ng-if=\"multiBind === undefined\" ng-bind=\"item[bind]\"></span>" +
                        "<span ng-if=\"multiBind !== undefined\" ng-repeat=\"toBind in multiBind\" ng-bind=\"' ' + item[toBind]\"></span>" +
                    "</li>" +
                "</ul>" +
            "</div> ",
        scope: {
            list: "=",
            label: "@",
            model: "@",
            multiBind: "=",
            multiple: "=",
            bind: "@",
            help: "@?",
            lang: "@"
        },
        link: function (scope, element, attrs, ngModel) {
            if (!angular.isUndefined(scope.help)) {
                console.warn("******mdbSelect Helper****** \n");
                console.info("Example:" +
                    "\n=>Controller" +
                    "\n       $scope.array = [{fName: 'jason', lName: 'bourne'},{fName: 'james', lName: 'bond'}]" +
                    "\n       $scope.movies = {}" +
                    "\n       //data-model is removeable, if you want to return object do not use it" +
                    "\n       //you can use one of 'data-bind' OR 'data-multi-bind'" +
                    "\n\n=>Html: " +
                    "\n       <mdb-select " +
                    "\n       ng-model=\"movies\" " +
                    "\n       data-list=\"array\" " +
                    "\n       data-model=\"if null return object\" " +
                    "\n       data-bind=\"fName\" " +
                    "\n       data-multi-bind=\"['fName','lName']\">" +
                    "\n       </mdb-select>");
                console.warn("******mdbSelect Helper****** \n");
            }
            else {
                if (angular.isUndefined(scope.bind) && angular.isUndefined(scope.multiBind)) {
                    console.error("data-bind OR data-multi-bind not found in your element");
                    return false;
                }
                else {

                    scope.languages = {
                        en: { multiple: "items has been selected." },
                        fa: { multiple: "گزینه انتخاب شده است." }
                    };

                    if (angular.isUndefined(scope.lang)) {
                        scope.lang = "en";
                    }

                    if (angular.isUndefined(scope.multiple)) {
                        //#region Expanded single select
                        if (!angular.isUndefined(scope.multiBind)) {
                            if (scope.multiBind.length === 1) {
                                console.warn("=> ng-model='" + attrs.ngModel + "'");
                                console.info("=> use 'data-multi-bind' to bind more then one params! \n=> use 'data-bind' to bind only one param.");
                            }
                            //multi bind
                            scope.$watch(ngModel.$modelValue, function() {
                                var template = "";
                                for (var i = 0; i < scope.multiBind.length; i++) {
                                    template += ngModel.$modelValue[scope.multiBind[i]] + " ";
                                }

                                if (angular.isUndefined(scope.model)) {
                                    //has no model
                                    scope.selected = ngModel.$modelValue;
                                    ngModel.$setViewValue(ngModel.$modelValue);
                                } else {
                                    //has model
                                    scope.selected = ngModel.$modelValue;
                                    ngModel.$setViewValue(ngModel.$modelValue[scope.model]);
                                }
                                //return active Option
                                scope.activeOption = template;
                            }, true);
                        } else {
                            //single bind
                            scope.$watch(ngModel.$modelValue, function() {
                                if (angular.isUndefined(scope.model)) {
                                    if (!angular.isUndefined(ngModel.$viewValue)) {
                                        //has no model = object
                                        scope.selected = ngModel.$modelValue;
                                        //return active Option
                                        scope.activeOption = ngModel.$modelValue[scope.bind];
                                        //set to ngModel
                                        ngModel.$setViewValue(ngModel.$modelValue);
                                    }
                                } else {
                                    if (!angular.isUndefined(ngModel.$viewValue)) {
                                        //has model = object[model]
                                        scope.selected = ngModel.$modelValue;
                                        //return active Option
                                        console.log(ngModel.$modelValue)
                                        scope.activeOption = ngModel.$modelValue[scope.bind];
                                        //set to ngModel
                                        ngModel.$setViewValue(ngModel.$modelValue[scope.model]);
                                    }
                                }
                            }, true);
                        }

                        scope.select = function(item) {
                            if (angular.isUndefined(scope.model)) {
                                ngModel.$setViewValue(item);
                            } else {
                                ngModel.$setViewValue(item[scope.model]);
                            }

                            if (!angular.isUndefined(scope.multiBind)) {
                                var template = "";
                                for (var i = 0; i < scope.multiBind.length; i++) {
                                    template += item[scope.multiBind[i]] + " ";
                                }
                                scope.activeOption = template;
                            } else {
                                scope.activeOption = item[scope.bind];
                            }
                            scope.selected = item;
                        }
                        //#endregion
                    } else {

                        var findActivate = $filter("filter")(scope.list, { set: true });

                        scope.activeOption = findActivate.length;

                        ngModel.$setViewValue(findActivate);

                        scope.multipleSelect = function (item) {
                            item.set = !item.set;

                            findActivate = $filter("filter")(scope.list, { set: true });

                            scope.activeOption = findActivate.length;

                            ngModel.$setViewValue(findActivate);
                        }
                    }
                }
            }
        }
    }
}]);