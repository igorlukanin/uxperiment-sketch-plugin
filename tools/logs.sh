#!/bin/bash
echo "Listening to system log for Sketch Plugin log()'s"
tail -f /var/log/system.log | grep --line-buffered -E 'Sketch Plugin|^\t' | sed -E "s/.*[[:digit:]]{2} [^ ]+(.*) \(Sketch Plugin\)\[[[:digit:]]+\]/\1/"
