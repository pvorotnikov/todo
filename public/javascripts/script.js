'use strict';

$(document).ready(function() {

    /**
     * Configuration and properties
     */
    var API_BASE = 'http://127.0.0.1:3000';
    var $container = $('#container');
    var credentials = null;


    /**
     * DOM construction
     */
    var $login = $('<todo-login></todo-login>');
    var $todoBox = $('<todo-box></todo-box>')

    /**
     * login event handler.
     * @param {Event}
     */
    function onLogin($e) {
        var username = $e.originalEvent.detail.username;
        var password = $e.originalEvent.detail.password;

        $.ajax({
            type: 'POST',
            url: API_BASE + '/user/validate',
            data: {username: username, password: password},
            dataType: 'json',
            crossDomain: true,
            cache: false,
            success: (data) => {
                if (data.data) {
                    credentials = btoa(username + ':' + password);
                    openTodoBox();
                } else {
                    // user is not valid
                    this.openToast('Wrong username or password');
                }
            },
            error: (xhr, status, err) => {
                this.openToast(err.toString());
            }
        });
    }

    /**
     * signup event handler.
     * @param {Event}
     */
    function onSignup($e) {
        var username = $e.originalEvent.detail.username;
        var password = $e.originalEvent.detail.password;
    }

    /**
     * logout event handler.
     * @param {Event}
     */
    function onLogout($e) {
        openLogin();
    }

    /**
     * add event handler.
     * @param {Event}
     */
    function onAdd($e) {
        // create todo
        $.ajax({
            type: 'POST',
            url: API_BASE + '/todo/0/My TODO',
            dataType: 'json',
            crossDomain: true,
            cache: false,
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
            },
            success: (data) => {
                refreshTodos();
            },
            error: (xhr, status, err) => {
                $todoBox[0].openToast(err.toString());
            }
        });
    }

    /**
     * delete event handler.
     * This event is emitted from both todo-box and todo-item.
     * The implementation should decide on what action to take
     * depending on the event's target.
     * @param {Event}
     */
    function onDelete($e) {

        switch ($e.target) {

            // delete user
            case $todoBox[0]:
                openLogin();
                break;

            // delte topic
            default:
                var todo = $e.target;

                // delete todo
                $.ajax({
                    type: 'DELETE',
                    url: API_BASE + '/todo/' + todo.id,
                    dataType: 'json',
                    crossDomain: true,
                    cache: false,
                    beforeSend: (xhr) => {
                        xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
                    },
                    success: (data) => {
                        refreshTodos();
                    },
                    error: (xhr, status, err) => {
                        $todoBox[0].openToast(err.toString());
                    }
                });
                break;
        }
    }

    /**
     * save event handler.
     * @param {Event}
     */
    function onSave($e) {
        var todo = $e.target;

        // save todo
        $.ajax({
            type: 'PUT',
            url: API_BASE + '/todo/' + todo.id + '/' + (todo.done ? '1' : '0') + '/' + todo.text,
            dataType: 'json',
            crossDomain: true,
            cache: false,
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
            },
            success: (data) => {
                refreshTodos();
            },
            error: (xhr, status, err) => {
                $todoBox[0].openToast(err.toString());
            }
        });
    }

    function refreshTodos() {
        // request all todos
        $.ajax({
            type: 'GET',
            url: API_BASE + '/todo',
            dataType: 'json',
            crossDomain: true,
            cache: false,
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', 'Basic ' + credentials);
            },
            success: (data) => {
                $todoBox.empty();
                data.data.forEach(function(todo) {
                    var $item = $('<todo-item></todo-item>');
                    $item.attr({id: todo.id});
                    $item.attr({text: todo.text});
                    $item.attr({data: JSON.stringify(todo)});
                    if (todo.done) {
                        $item.attr({done: 'done'});
                    }
                    $todoBox.append($item[0]);
                });
            },
            error: (xhr, status, err) => {
                $todoBox[0].openToast(err.toString());
            }
        });
    }

    function openLogin($e) {
        $container.empty();
        $login.on('login', onLogin);
        $login.on('signup', onSignup);
        $container.append($login);
    }

    function openTodoBox($e) {
        $container.empty();
        $todoBox.on('logout', onLogout);
        $todoBox.on('add', onAdd);
        $todoBox.on('delete', onDelete);
        $todoBox.on('save', onSave);
        $container.append($todoBox);

        refreshTodos();
    }

    openLogin();
});
