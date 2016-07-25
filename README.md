# Angular-Matrial-Design-Bootstrap-Select-Option
Change your select options style

#How to use it
```javascript
  var app = angular.module("app", ["angularMdbSelect"]);
  
  $scope.array = [
    { name: "hello", last: "world", code: 1 },
  ];
```

#help:
see a example in browser console, select option not work when use help
```html
<mdb-select ng-model="select" help="?"></mdb-select>
```

#ng-model: required
```html
<mdb-select ng-model="select"></mdb-select>
```

#data-list: array
```html
<mdb-select ng-model="select" data-list="array"></mdb-select>
```

#data-label: string
```html
<mdb-select ng-model="select" data-list="array" data-label="label name"></mdb-select>
```

#data-bind: 
string-> bind one of object params
not work when use data-multi-bind
```html
<mdb-select ng-model="select" data-list="array" data-label="label name" data-bind="name"></mdb-select>
```

#data-multi-bind: 
string array-> bind more then one of object params
```html
<mdb-select ng-model="select" data-list="array" data-label="label name" data-multi-bind="['name','last','code']"></mdb-select>
```

#data-model: 
string -> bind one of object params
removeable
```html
<mdb-select ng-model="select" data-list="array" data-label="label name" data-multi-bind="['name','last','code']" data-model="name OR last OR code"></mdb-select>
```
