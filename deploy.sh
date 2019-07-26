docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD repo.treescale.com
docker build . -t repo.treescale.com/jakemakesstuff/dns-prototype
docker push repo.treescale.com/jakemakesstuff/dns-prototype
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
wget --header "Content-Type: application/json" --header "Authorization: Bearer $DIGITALOCEAN_TOKEN" "https://api.digitalocean.com/v2/kubernetes/clusters/e7e5e2f5-971e-4d09-8ed8-ac5c4c02be0d/kubeconfig"
./kubectl --kubeconfig=./kubeconfig rollout restart statefulset/do-prototype
