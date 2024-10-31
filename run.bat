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
set "bot_pid="
call :start_bot

rem Infinite loop to listen for commands
:loop
set /p command="Enter command (stop/runtime/info/reload): "

if /i "!command!"=="stop" (
    taskkill /PID !bot_pid! /F
    echo !YELLOW!Bot has been stopped.!RESET!
    exit /b
) else if /i "!command!"=="runtime" (
    call :get_runtime
) else if /i "!command!"=="info" (
    echo !CYAN!Knight bot, is a test bot developed by @whovanilla. Contact her for help.!RESET!
) else if /i "!command!"=="reload" (
    call :reload_bot
) else (
    echo !RED!Invalid command. Try 'stop', 'runtime', 'info', or 'reload'.!RESET!
)
goto loop

:start_bot
rem Start the bot in the background and get its process ID
start /b node index.js
for /f "tokens=2" %%a in ('tasklist /FI "IMAGENAME eq node.exe" /FO LIST ^| findstr PID') do set "bot_pid=%%a"
echo !GREEN!Bot started with PID !bot_pid!!RESET!
exit /b

:reload_bot
rem Kill the existing bot process and start it again
taskkill /PID !bot_pid! /F
echo !YELLOW!Reloading bot...!RESET!
call :start_bot
exit /b

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
