function foo(arg1=123, arg2=456, ...rest)
{
    var foo2 = function( arg3=678, ...rest2) {
        console.log(arg3);
    };
    var foo3 = function( arg4=234, ...rest3) {
        console.log(arg4);
        var foo4 = function( arg5=368, ...rest4) {
            console.log(arg5);
        };
    };
    console.log(arg1);
}

function foo7(arg11=123, arg12=456, ...rest11)
{
    console.log(arg11);
}