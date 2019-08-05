#!/usr/bin/env bash

# Copyright 2019 DigitalOcean
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD repo.treescale.com
docker build . -t repo.treescale.com/jakemakesstuff/dns-prototype
docker push repo.treescale.com/jakemakesstuff/dns-prototype
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
wget --header "Content-Type: application/json" --header "Authorization: Bearer $DIGITALOCEAN_TOKEN" "https://api.digitalocean.com/v2/kubernetes/clusters/e7e5e2f5-971e-4d09-8ed8-ac5c4c02be0d/kubeconfig"
./kubectl --kubeconfig=./kubeconfig rollout restart statefulset/do-prototype
