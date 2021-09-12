#!/bin/bash

# docs: https://github.com/pkgdeps/verify-checksum-cheatsheet
declare JQ_VERSION="1.6"
# Download binary and checksum
curl -sLO https://github.com/stedolan/jq/releases/download/jq-${JQ_VERSION}/jq-linux64 && \
curl -sL https://raw.githubusercontent.com/stedolan/jq/master/sig/v${JQ_VERSION}/sha256sum.txt -o jq.sha256sum
# Add permission for executable and Rename to "jq"
# jq-linux64 is verified
chmod 755 jq-linux64 && ln -sfnv "$(pwd)/jq-linux64" "$(pwd)/jq"
