# Service Types

There are several service types which can be used to expose apps for different requirements.

## ClusterIP
The ClusterIP service type is the default, and only provides access internally on a cluster internal IP. Not exposing a service outside the cluster is not very useful, so this service type can be used for accessing internal traffic only or for debugging etc. It can however be used with other kubernetes resources, which will be useful as we will see in the upcoming section.

## NodePort
The NodePort type exposes the service on a static port on each node. Each Node proxies that same port number on every Node into the Service. This type of service does expose the app to the outside world, however it is only good for short term public access or for debugging, and not recommended for production applications. The disadvantages being, that we can only have one service per port, there is a limited number of ports we can use, and there needs to be special handling for cases of the Node IP changing, which may happen quite often in a continuous deployment environment.

## LoadBalancer
The LoadBalancer service exposes the app using a cloud provider’s load balancer. The external load balancer directs the traffic to the backend Pods. At first glance this seems quite a convenient way to expose your apps. A couple of caveats are that all traffic on the port you specify will be forwarded to the service, and there is no filtering or routing. The major disadvantage however is that each service you expose will get its own IP address which will be handled by a separate Load Balancer. Having 1 Load Balancer per service will mean a skyrocketing cost in a large scale application.