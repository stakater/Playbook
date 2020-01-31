# ExternalDNS

[[toc]]

While DNS entries can be manually entered into the DNS provider such as AWS Route53, it is not a scalable way of doing things, especially considering we are using the same Ingress Controller and Load Balancer to serve traffic for multiple services and consequently domain names, that are being filtered and routed at the ingress level. DNS resolution is provided as a Kubernetes add-on in clusters. As services are created, they get automatically registered in DNS and the service can be referenced by name when being accessed from other pods or services. However this is only an internal name server and does not cater to public DNS.

At Stakater we use the ExternalDNS project. This nifty tool automates DNS entries for our application deployments. ExternalDNS looks at the resources (Services, Ingresses, etc.) being exposed and determines the list of DNS records to be configured. It is DNS provider-agnostic and can be used with popular DNS providers such as AWS Route53. The tool keeps the DNS entries in sync with the cluster, which means not only does it add DNS entries for a new exposed app, but it also cleans up the entries when the app is removed from the cluster.

More on this tool [here](/content/tools/global/external-dns/developer-documentation.md)