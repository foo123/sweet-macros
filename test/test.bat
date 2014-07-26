@echo off

rem call sjs -t -m ../macros/function.sweet.js test_function2.js > test_function_compiled.js
call sjs -p -m ../macros/define.sweet.js test_define.js > test_define_compiled.js
