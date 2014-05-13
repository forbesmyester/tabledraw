#!/bin/sh
PROJECT_ROOT=`pwd`


# Install Node packages
npm -s install

# Install Browser components
bower -s install

mkdir -p js/vendor/zeptojs.com
wget http://zeptojs.com/zepto.js -O js/vendor/zeptojs.com/zepto.js

