/** 
*   sweet.js macro for function and arguments
**/

// DEFAULT_PARAMS_ initializes function/method parameters to given values
macro DEFAULT_PARAMS_
{
    case { $default #$numargs:lit# $param:ident = $value:expr , $rest ... } => { 
        var numargs = unwrapSyntax(#{ $numargs });
        letstx $numargsNext = [makeValue(parseInt(numargs, 10)+1, #{$default})];
        return #{
            if ($numargsNext > arguments.length) $param = $value;
            DEFAULT_PARAMS_ #$numargsNext# $rest ... 
        }
    }
    
    case { _ #$numargs:lit# $param:ident = $value:expr $rest ... } => { 
        var numargs = unwrapSyntax(#{ $numargs });
        letstx $numargsNext = [makeValue(parseInt(numargs, 10)+1, #{$default})];
        return #{
            if ($numargsNext > arguments.length) $param = $value;
            $rest ... 
        }
    }
    
    case { $default #$numargs:lit# $param:ident , $rest ... } => { 
        var numargs = unwrapSyntax(#{ $numargs });
        letstx $numargsNext = [makeValue(parseInt(numargs, 10)+1, #{$default})];
        return #{
            DEFAULT_PARAMS_ #$numargsNext# $rest ...
        }
    }
    
    case { _ #$numargs:lit# $[...]$param:ident $rest ... } => { 
        return #{
            var $param = Array.prototype.slice.call(arguments, $numargs);
            $rest ...
        }
    }
    
    // rest ...
    case { _ #$numargs:lit# $rest ... } => { 
        return #{
            $rest ...
        }
    }
    
    case { _ $rest ... } => { 
        return #{
            $rest ...
        }
    }
}

// WITH_DEFAULTS_ (adapted from https://github.com/jlongster/es6-macros)
macro WITH_DEFAULTS_ {
    rule { ($args ...) [[ ]] $body $rest ... } => {
        ($args ...) $body $rest ...
    }
    
    rule { [[$args ...]] {macro $macro $macrobody $body ...} $rest ... } => {
        WITH_DEFAULTS_ ( ) [[$args ...]] {macro $macro $macrobody DEFAULT_PARAMS_ #0# $args ... $body ...} $rest ...
    }
    
    rule { [[$args ...]] {$body ...} $rest ... } => {
        WITH_DEFAULTS_ ( ) [[$args ...]] {DEFAULT_PARAMS_ #0# $args ... $body ...} $rest ...
    }
    
    rule { ($args ...) [[$param:ident = $val:expr $resta ...]] $body $rest ... } => {
        WITH_DEFAULTS_ ($args ... $param) [[$resta ...]] $body $rest ...
    }

    rule { ($args ...) [[$param:ident $resta ...]] $body $rest ... } => {
        WITH_DEFAULTS_ ($args ... $param) [[$resta ...]] $body $rest ...
    }

    rule { ($args ...) [[, $[...]$param:ident $resta ...]] $body $rest ... } => {
        WITH_DEFAULTS_ ($args ...) [[$resta ...]] $body $rest ...
    }

    rule { ($args ...) [[, $resta ...]] $body $rest ... } => {
        WITH_DEFAULTS_ ($args ... ,) [[$resta ...]] $body $rest ...
    }

    rule { $rest ... } => {
        $rest ...
    }
}

// parses nested function definitions
macro WITH_NESTED_FUNCTIONS_ {
    rule { function $func:ident ( $args ... ) { $body ... } $rest ... } => {
        function $func WITH_DEFAULTS_ [[ $args ... ]] {
            WITH_NESTED_FUNCTIONS_ $body ...
        } WITH_NESTED_FUNCTIONS_ $rest ...
    }
    rule { function ( $args ... ) { $body ... } $rest ... } => {
        function WITH_DEFAULTS_ [[ $args ... ]] {
            WITH_NESTED_FUNCTIONS_ $body ...
        } WITH_NESTED_FUNCTIONS_ $rest ...
    }
    rule { $rest ... } => {
        $rest ...
    }
}

// parses the initial function definitions
let function = macro 
{
    case { _ $func:ident ( $args ... ) { $body ... } } => { 
        return #{ 
            function $func WITH_DEFAULTS_ [[ $args ... ]] {
                WITH_NESTED_FUNCTIONS_ $body ...
            }
        }
    }
    case { _ ( $args ... ) { $body ... } } => { 
        return #{ 
            function WITH_DEFAULTS_ [[ $args ... ]] {
                WITH_NESTED_FUNCTIONS_ $body ...
            }
        }
    }
}

// export it
export function
