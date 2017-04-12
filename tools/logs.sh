#!/bin/bash
echo "Listening to system log for Sketch Plugin log()'s"
tail -f ~/Library/Logs/com.bohemiancoding.sketch3/Plugin\ Output.log
