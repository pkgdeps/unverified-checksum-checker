#!/usr/bin/env bash
set -eux

CURRENT_DIR=$(cd $(dirname $0); pwd)
ROOT_DIR=$CURRENT_DIR/..
BIN_DIR=$ROOT_DIR/bin
KUSTOMIZE_VERSION=3.4.0
KUBECTL_VERSION=1.16.0
CONFTEST_VERSION=0.17.0

mkdir -p ${BIN_DIR}
# install kustomize
curl -L https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv${KUSTOMIZE_VERSION}/kustomize_v${KUSTOMIZE_VERSION}_darwin_amd64.tar.gz -o ${BIN_DIR}/kustomize.tar.gz
tar zxvf ${BIN_DIR}/kustomize.tar.gz -C ${BIN_DIR}
rm ${BIN_DIR}/kustomize.tar.gz
chmod +x ${BIN_DIR}/kustomize

# install kubectl
curl -L https://storage.googleapis.com/kubernetes-release/release/v${KUBECTL_VERSION}/bin/darwin/amd64/kubectl -o ${BIN_DIR}/kubectl
chmod +x ${BIN_DIR}/kubectl

# install conftest
curl -L https://github.com/instrumenta/conftest/releases/download/v${CONFTEST_VERSION}/conftest_${CONFTEST_VERSION}_Darwin_x86_64.tar.gz -o ${BIN_DIR}/conftest.tar.gz
tar zxvf ${BIN_DIR}/conftest.tar.gz -C ${BIN_DIR}
rm ${BIN_DIR}/conftest.tar.gz
chmod +x ${BIN_DIR}/conftest

curl -L https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl -o /usr/local/bin/kubectl && chmod 755 /usr/local/bin/kubectl

pip install -U pip setuptools && \
curl -o /usr/local/bin/jq -L https://github.com/stedolan/jq/releases/download/jq-1.6/jq-linux64 && \
chmod +x /usr/local/bin/jq && \
pip install yq
