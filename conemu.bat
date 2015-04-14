@echo off
start ConEmu64 /cmdlist "npm install && bower install && gulp watch --dev" -cur_console:fn ^|^|^| cmd -cur_console:s2T60V