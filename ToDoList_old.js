var todoModel = (function () {

    var _data = [];
    function _addItem(name, duedate, completed, description, show, sel) {
        _data.push({
            name: name,
            duedate: duedate,
            completed: completed,
            description: description,
            show: true,
            sel: false
        });
    }

    function _save() {
        window.localStorage.tasks = JSON.stringify(_data, function (key, val) {
            if (key == '$$hashKey') {
                return undefined;
            } else {
            return val;}
        });
    }

    function _read() {
        var temp = localStorage.tasks;
        if (!temp) _data = [];
        else _data = JSON.parse(temp);
        return _data;
    }
    return {
        data: _data,
        addItem: _addItem,
        save: _save,
        read: _read
    };
})();

var m = angular.module("FormApp", []);

// Контроллер
m.controller("FormCtrl", function ($scope) {
    $scope.data = todoModel.read();
    $scope.addNewElm = function () {
      $scope.checkbox = function () {
          var t = $scope.elmCompleted;
          return t ? "Yes" : "No";
        };
        todoModel.addItem($scope.elmName, $scope.elmDuedate, $scope.checkbox(), $scope.elmDescription, $scope.elmShow, $scope.elmSel);
        todoModel.save();
        //location.reload();
    };
//функция сохранения данных в localStorage
    $scope.save = function () {
        todoModel.save();
    };
    $scope.read = function () {
        todoModel.read();
    };
//функция перезагрузки страницы
  //  $scope.reload = function () {
  //    $.ajax({
  //      url: "ToDoList5.html",
  //      cache: false,
    //    success: function(html){
    //    $("#cont").html(html);
    //    }
  //    });
  //  };
//правило для сортировки
     $scope.sortRul = function (sortValue) {
         switch (sortValue) {
             case undefined:
                 return "duedate";
             case "Date":
                 return "duedate";
             case "Name":
                 return "name";
             case "Completed":
                 return "completed";
             case "Select":
                 return "sel";
         }
     };
//вотчер для картинок сортировки в заголовке таблицы
     $scope.$watch('reverse', function (value) {
        if (value) {
          $scope.arrowSrc = 'images/Sort-up.png';
        } else {
          $scope.arrowSrc = 'images/Sort-down.png';
        }
      });
//функция дляудаления элемента
   $scope.removeElm = function () {
       var checkboxList = document.getElementsByName('del');
       var i = checkboxList.length;
       var a = JSON.parse(localStorage.getItem('tasks'));
       while (i--) {
           if (checkboxList[i].checked) {
              //checkboxList[i].parentNode.parentNode = null;
               checkboxList[i].parentNode.parentNode.remove();
           }
           if (a[i].sel) {
               a.splice(i, 1);
               window.localStorage["tasks"] = JSON.stringify(a);
               //$('#cont').load();
              // todoModel.read();
              location.reload();
           }
       }
   };
   $scope.now = new Date().toISOString();
//анимация заголовка
/*  $( document ).ready( function(){
    $.fn.animate_Text = function() {
     var string = this.text();
     return this.each(function(){
      var $this = $(this);
      $this.html(string.replace(/./g, '<span class="new">$&</span>'));
      $this.find('span.new').each(function(i, el){
       setTimeout(function(){ $(el).addClass('div_opacity'); }, 150 * i);
      });
     });
    };
    $.fn.animate_Text2 = function(){
      setTimeout(function(){
        $('#textAnim').animate({
            fontSize: "60px",
            marginTop: "0px",
          }, 1500 );
        },1500);
    };
    $("#cont").hide();
    $('#textAnim').show();
    $('#textAnim').animate_Text();
    $('#textAnim').animate_Text2();
    setTimeout(function(){document.getElementById('textAnim').removeAttribute('id')},6000);
   });
//функция для задержки загрузки контента, пока заголовок не загрузится
$(window).load(function() {
  setTimeout(function() {$("#cont").show();},3000);
});
 // функция устанавливает id для заголовка призакрытии стр, чтобы при повторном открытии анимация заголовка сработала
 $(window).unload(function() {
   $(".header").attr('id','textAnim');
 });*/
//функция для отображения даты в DatePicker
   angular.element(document).ready(function () {
            var dateInArr = document.getElementsByName('dateIn');
            var dateInCheckArr = document.getElementsByName('dateInCheck');
            var j = dateInArr.length;
            while (j--) {
              dateInCheckArr[j].value = dateInArr[j].innerHTML;
              }
            });
 });

 // DatePicker
 m.controller('datepickerCtrl',  ['$scope', function($scope) {
   	var vm = this;
 }]);
 // DatePicker -> NgModel директива
 m.directive('datePicker', function () {
     return {
         require: 'ngModel',
         link: function (scope, element, attr, ngModel) {
             $(element).datetimepicker({
                 locale: 'EN',
                 format: 'YYYY-MMM-DD',
                 parseInputDate: function (data) {
                     if (data instanceof Date) {
                         return moment(data);
                     } else {
                          return moment(new Date(data));
                     }
                 },
             });
             $(element).on("dp.change", function (e) {
               var a = ngModel.$modelValue;
                 ngModel.$viewValue = e.date;
                 ngModel.$commitViewValue();
                  if(a != e.date.toISOString() && $(element).parents(2).is('tr'));
                  {setTimeout(function(){location.reload()}, 5000);}
                //   var now = new Date().toISOString();
              //   if(e.date.toISOString()<now)
                //    {$(element).parents('tr').eq(0).css('background-color','rgba(255, 0, 0, 0.2)')}
                  //  else {$(element).parents('tr').eq(0).css('background-color','rgba(255, 255, 255)')}
                    todoModel.save();
                 if(a == e.date.toISOString() && $(element).parents(2).is('tr') || a == new Date().toISOString() && $(element).parents(2).is('tr') || a === undefined && $(element).parents(2).is('tr')) {setTimeout(function(){location.reload()}, 5000);}
                 //переделать строку эту, т.к. с перезагрузкой все работает странно
             });
         }
     };
 });
 m.directive('datePickerInput', function() {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            // Trigger the Input Change Event, so the Datepicker gets refreshed
            scope.$watch(attr.ngModel, function (value) {
                if (value) {
                    element.trigger("change");
                }
            });
        }
    };
});
