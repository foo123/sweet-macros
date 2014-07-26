#!/usr/bin/env sh

sjs -m ../macros/function.sweet.js test_function.js > test_function_compiled.js
sjs -m ../macros/define.sweet.js test_define.js > test_define_compiled.js
