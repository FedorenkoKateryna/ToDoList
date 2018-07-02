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
        window.localStorage["tasks"] = JSON.stringify(_data, function (key, val) {
            if (key == '$$hashKey') {
                return undefined;
            }
            return val
        });
    }

    function _read() {
        var temp = localStorage["tasks"];
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
            var t = $scope.elmCompleted
            return t ? "Yes" : "No";
        }
        todoModel.addItem($scope.elmName, $scope.elmDuedate.toLocaleDateString(), $scope.checkbox(), $scope.elmDescription, $scope.elmShow, $scope.elmSel);
        todoModel.save();
    }
    $scope.save = function () {
        todoModel.save();
    }

    $scope.removeElm = function () {
        var checkboxList = document.getElementsByName('del');
        var i = checkboxList.length;
        var a = JSON.parse(localStorage.getItem('tasks'));
        while (i--) {
            if (checkboxList[i].checked) {
                // alert(checkboxList[i].checked);
                checkboxList[i].parentNode.parentNode.remove();
            }
            if (a[i].sel) {
                a.splice(i, 1);
                window.localStorage["tasks"] = JSON.stringify(a);
                location.reload();
            }
        }
    }
});
