@echo off
setlocal enabledelayedexpansion

rem Set color codes
set "RESET=[0m"
set "YELLOW=[33m"
set "CYAN=[36m"
set "GREEN=[32m"
set "RED=[31m"

rem Start the bot and save the start time
set "start_time=%time%"
start /b node index.js

rem Infinite loop to listen for commands
:loop
set /p command="Enter command (stop/runtime/info): "

if /i "!command!"=="stop" (
    taskkill /F /IM node.exe
    echo !YELLOW!Bot has been stopped.!RESET!
    exit /b
) else if /i "!command!"=="runtime" (
    call :get_runtime
) else if /i "!command!"=="info" (
    echo !CYAN!Knight bot, is a test bot developed by @whovanilla. Contact her for help.!RESET!
) else (
    echo !RED!Invalid command. Try 'stop', 'runtime', or 'info'.!RESET!
)
goto loop

:get_runtime
rem Get current time and calculate runtime
set "current_time=%time%"
call :time_diff "%start_time%" "%current_time%"
exit /b

:time_diff
rem Calculate the difference in time
setlocal
set "start=%~1"
set "end=%~2"

rem Convert time to seconds for easier calculation
for /f "tokens=1,2,3 delims=:" %%a in ("%start%") do (
    set /a start_sec=%%a*3600 + %%b*60 + %%c
)
for /f "tokens=1,2,3 delims=:" %%a in ("%end%") do (
    set /a end_sec=%%a*3600 + %%b*60 + %%c
)

rem Handle case where the end time is less than the start time (crosses midnight)
if !end_sec! lss !start_sec! (
    set /a end_sec+=86400
)

set /a diff_sec=end_sec-start_sec

rem Calculate hours, minutes, and seconds
set /a hours=diff_sec/3600
set /a minutes=(diff_sec%%3600)/60
set /a seconds=diff_sec%%60

echo !YELLOW!Bot has been running for !hours! hours, !minutes! minutes, and !seconds! seconds.!RESET!
endlocal
exit /b
