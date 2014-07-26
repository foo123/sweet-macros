/** 
*   sweet.js common/util macros used by other macros
**/

let __TO_STR__ = macro 
{
    case { _ $tok } => { return [makeValue(unwrapSyntax(#{ $tok }), #{ $tok })]; }
}


// export it
export __TO_STR__
