#!/usr/bin/env bash
set -eux

CURRENT_DIR=$(cd $(dirname $0); pwd)
ROOT_DIR=$CURRENT_DIR/..
BIN_DIR=$ROOT_DIR/bin
KUSTOMIZE_VERSION=4.0.0
KUBECTL_VERSION=1.0.0
CONFTEST_VERSION=0.20.0

mkdir -p ${BIN_DIR}

# install kustomize
# https://github.com/pkgdeps/curl-kustomize-checksum-example
curl -LO "https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv${KUSTOMIZE_VERSION}/kustomize_v${KUSTOMIZE_VERSION}_darwin_amd64.tar.gz" && \
curl -L "https://github.com/kubernetes-sigs/kustomize/releases/download/kustomize%2Fv${KUSTOMIZE_VERSION}/checksums.txt" -o kustomize.checksums.txt
grep -e "kustomize_v${KUSTOMIZE_VERSION}_darwin_amd64.tar.gz$" kustomize.checksums.txt | shasum --check - || (echo "Error: Not match kustomize checksum." && exit 1)
tar zxvf "kustomize_v${KUSTOMIZE_VERSION}_darwin_amd64.tar.gz" -C "${BIN_DIR}"
rm "kustomize_v${KUSTOMIZE_VERSION}_darwin_amd64.tar.gz" kustomize.checksums.txt
chmod +x "${BIN_DIR}/kustomize"

# install kubectl
# https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
curl -L "https://dl.k8s.io/release/v${KUBECTL_VERSION}/bin/darwin/amd64/kubectl" -o "${BIN_DIR}/kubectl" && \
curl -L "https://dl.k8s.io/v${KUBECTL_VERSION}/bin/darwin/amd64/kubectl.sha256" -o "${BIN_DIR}/kubectl.sha256"
echo "$(<${BIN_DIR}/kubectl.sha256) ${BIN_DIR}/kubectl" | sha256sum --check
rm "${BIN_DIR}/kubectl.sha256"
chmod +x ${BIN_DIR}/kubectl

# install conftest
# https://github.com/open-policy-agent/conftest/releases
curl -LO "https://github.com/open-policy-agent/conftest/releases/download/v${CONFTEST_VERSION}/conftest_${CONFTEST_VERSION}_Darwin_x86_64.tar.gz" && \
curl -L "https://github.com/open-policy-agent/conftest/releases/download/v${CONFTEST_VERSION}/checksums.txt" -o conftest.checksums.txt
grep -e "conftest_${CONFTEST_VERSION}_Darwin_x86_64.tar.gz$" conftest.checksums.txt | shasum --check - || (echo "Error: Not match kustomize checksum." && exit 1)
tar zxvf "conftest_${CONFTEST_VERSION}_Darwin_x86_64.tar.gz" -C ${BIN_DIR}
rm "conftest_${CONFTEST_VERSION}_Darwin_x86_64.tar.gz" conftest.checksums.txt
chmod +x ${BIN_DIR}/conftest
