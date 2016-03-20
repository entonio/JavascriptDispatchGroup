'use strict';

/*
* Inspired by https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man3/dispatch_group_notify.3.html
*/
var DispatchGroup = (function() {
    var nextId = 0

    function DispatchGroup() {
        var id = ++nextId
        var tokens = new Set()
        var onCompleted = null

        function checkCompleted() {
            if(!tokens.size) {
                if(onCompleted) {
                    onCompleted()
                    console.log('group ' + id + ' completed')
                }
            }
        }

        // the only requirement for this is that it's unique during the group's cycle
        function nextToken() {
            return Date.now() + Math.random()
        }

        this.enter = function () {
            let token = nextToken()
            tokens.add(token)
            console.log('group ' + id + ' enter ' + token)
            return token
        }

        this.leave = function (token) {
            if(!token) throw new Error("'token' must be the value earlier returned by '.enter()'")
            tokens.delete(token)
            console.log('group ' + id + ' leave '+token)
            checkCompleted()
        }

        this.notify = function (whenCompleted) {
            if(!whenCompleted) throw new Error("'whenCompleted' must be defined")
            onCompleted = whenCompleted
            checkCompleted()
        }
    }

    return DispatchGroup;
})()
