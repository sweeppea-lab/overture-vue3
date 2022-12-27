#!/bin/bash

# Count Lines of Code / Store File with Date (MM/DD/YYYY)
cloc --exclude-list-file=.clocignore --out=cloc_history/cloc_output-$(date +%m-%d-%Y) .

# Obtain /dist build size and append results to this file
du -hs frontend/dist >> cloc_history/cloc_output-$(date +%m-%d-%Y)
