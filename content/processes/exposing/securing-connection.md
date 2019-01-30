# Securing the Connection
With a HTTPS connection, all communications are securely encrypted. A certificate enables a secure connection between the web server and the browser that connects to it. At Stakater we have used a couple of methods for handling certificates.

## Cert-Manager
First is a nice tool, Cert-manager by Jetstack to automate the issuing and even renewal of certificates using an issuing source. With this we can use a Cluster Issuer of Let's Encrypt which is a free, automated, and open certificate authority. The `certmanager.k8s.io/cluster-issuer` annotation as in the above code snippet is used to indicate this. Xposer will apply this annotation as-is on the Ingress it creates, and that will in turn get read by Cert Manager.

## AWS Certificate Manager
Another option we make use of is the AWS Certificate Manager. A certificate can be issued, and multiple additional names can be specified apart from the root domain name. Considering the conventions for Ingress URLs we discussed above, we can add additional wildcard names such as `*.labs.company.com`,`*.tools.company.com`, etc. These wildcards will be applicable to ingresses in the `labs` or `tools` namespaces with the domain `company.com`.The certificate can be installed on the Load balancer.
