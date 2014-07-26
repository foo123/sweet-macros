/** 
*   sweet.js macro for function and arguments
**/

macro parse_define_ {
    case { $ctx [[$($k:ident $v:expr) (,) ...]] $tok:ident $restcode ... } => { 
        
        var tok = unwrapSyntax(#{ $tok }),
            defs = #{$($k $v) (,) ... }.map( unwrapSyntax ).join(' ').split(','),
            i, l = defs.length, kv, def = null
        ;
        
        //console.log('Parse Define, identifier ' + tok);
        //console.log(defs);
        for (i=0; i<l; i++)
        {
            kv = defs[ i ].replace(/^\s+/, '').split(' ');
            if ( tok === kv[ 0 ] )
            {
                def = kv.slice( 1 ).join(' ');
                break;
            }
        }
        
        if ( def )
        {
            return withSyntax($def = [makeValue(def, #{$ctx})]) #{
                $def parse_define_ [[$($k $v) (,) ...]] $restcode ...
            }
        }
        else
        {
            return #{
                $tok parse_define_ [[$($k $v) (,) ...]] $restcode ...
            }
        }
    }
    case { _ [[$($k:ident $v:expr) (,) ...]] $tok $restcode ... } => { 
        //console.log('Parse Define, no identifier ' + unwrapSyntax(#{ $tok }));
        return #{
            $tok parse_define_ [[$($k $v) (,) ...]] $restcode ...
        }
    }
    case { _ [[$($k:ident $v:expr) (,) ...]] } => { 
        //console.log('Parse Define end');
        return #{  }
    }
    case { _ $rest ... } => { 
        //console.log('Parse Define rest ' + #{ $rest ... }.map(unwrapSyntax).join(' '));
        return #{ $rest ... }
    }
}

let define = macro {
    case { _ $key:ident $val:expr $restcode ... } => { 
        return #{ 
            parse_define_ [[$key $val]] $restcode ...
        }
    }
}


// export it
export define
