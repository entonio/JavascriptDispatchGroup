# Javascript async flow control

This is a simple API to make it possible to wait on the completion of parallel tasks. That goal is not really possible in Javascript, but a solution inspired on Apple's Grand Central Dispatch API, namely [dispatch groups](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man3/dispatch_group_notify.3.html) is quite simple to achieve.

## How to use
First of all, create a `DispatchGroup` object each time you wish to run a number of async tasks:

```javascript
var dispatch = new DispatchGroup()
```

Then, before starting each task, 'enter' the group and keep the returned token:

```javascript
var tokenForTaskA = dispatch.enter()
```
    
At the point you exit a task, 'leave' the group:

```javascript
taskA.runAsychronsouly(function(result) {
    if (result == 'done') {
        // the task ends here, so leave the group
        dispatch.leave(tokenForTaskA)
    }
    else {
        doSomeMoreAsyncStuff(function() {
            // the task ends here, so leave the group
            dispatch.leave(tokenForTaskA)
        })
    }
})
```

Do this for as many tasks as you need:

```javascript
var tokenForTaskB = dispatch.enter()
taskB.runAsycToo(function() {
    ...
    dispatch.leave(tokenForTaskB)
})
```

Then, at the point where you need to wait for all the tasks to have completed, do this:

```javascript
dispatch.notify(function() {
    // the code to be run when all the tasks are finished
})
```

These were examples with different tasks, but it could also be done with a loop, for instance:

```javascript
var dispatch = new DispatchGroup()

for(var i in array) {
    // 'let' allows us to reuse the 'token' identifier,
    // otherwise we'd need an array because 'token'
    // would be captured as a variable by the function below
    let token = dispatch.enter()
    doAsyncStuff(array[i], function() {
        dispatch.leave(token)
    })
}

dispatch.notify(function() {
    // continue with the program
})
```

## Contributing
This is a very simple piece of code and as such no changes are really planned, unless for bugfixing. Feel free to share ideas, but if there is some change you'd like, your best bet is probably to take the code and improve on it.
