# How to deploy
1. Make sure `kubectl` is configured correctly with your kubernetes cluster. i.e. `~/.kube/config`
2. Create a new namespace `logging` in the cluster. Save the following line below in a file named `namespace_logging.yaml`
```
apiVersion: v1
kind: Namespace
metadata:
  name: logging
```
3. Run the following command
```
kubectl apply -f namespace_logging.yaml
```
4. Switch directory to `manifests` folder
```
cd manifests
```
5. Run the following command
```
kubectl apply -f . -n logging
```
6. After this command is executed successfully switch directory to `aws-elasticsearch` if you want to deploy on Aamazon Web Services (AWS) or `azure-elasricsearch` if you want to deploy on Microsoft Azure Cloud Platform.
```
cd [aws|azure]-elasticsearch/
```
7. Run the following command
```
kubectl apply -f . -n logging
```
8. It will take 3-4 minutes for kubernetes to completely reflect all the changes on the dasboard.