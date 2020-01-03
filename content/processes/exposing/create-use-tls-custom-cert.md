# Creating & using custom SSL Certificate

For TLS you need to have certificates against your domain. In this day and age it's mandatory to secure your website with HTTPS. 
There are multiple ways of creating certificates, we use [Let's Encrypt](https://letsencrypt.org/) as our certificate authority. 


## 1. Create certificates using terraform

We create certificate through terraform and LetsEncrypt using Acme, only con is that the certificate will have an expiry of 90 days.
For that refer to [terraform-aws-certificate](https://github.com/stakater/terraform-aws-certificate/) repo. Generate LetsEncrypt certificates for AWS(Route 53) hosted domain using Terraform.!

From [repositories documentation](https://github.com/stakater/terraform-aws-certificate/blob/master/README.md):


1. Install [Terraform](https://learn.hashicorp.com/terraform/getting-started/install.html) v11.6
2. Create a user on AWS with the set of [permissions attached](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage-attach-detach.html#add-policies-console) AmazonRoute53FullAccess, AWSCertificateManagerFullAccess, Route53CreateHostedZone
3. Install and setup [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html), ensure AWS credentials are in place
4. Update DOMAIN and domain ADMINISTRATOR_EMAIL in `variables.tf`
5. Run `terraform init` to initialize the working directory, run `terraform plan` to create an execution plan and finally run `terraform apply` to generate desired output.

    ```sh
   terraform init
   terraform plan
   terraform apply
    ```
6. It will take a few minutes to create certificates. Once complete, your certificates will be stored in `certificates.tf` file.

This output can be mapped to the following fields in a secret that would contain your certificate:

- ca.crt  ->  public_certificate_intermediate_pem
- tls.crt ->  public_certificate_pem
- tls.key ->  public_certificate_key

**Note:** If you are using Azure as DNS provider use [terraform-azure-openshift](https://github.com/stakater/terraform-azure-openshift/tree/master/certs) repo and follow the same steps.


## 2. Create certificates using https://www.sslforfree.com/

You can visit https://www.sslforfree.com/ and generate your certificates from there, this requires manual labour unlike terraform. 
It supports FTP verification, and verification against DNS & HTTP challenges.


## Using custom certificates


Create a secret file by running the following command and replace ca.crt, tls.crt and tls.key with your certificate 
values, generated in the above step or if you already have the certificate generated use those values.


```sh
cat <<-EOF > cert-secret.yaml
apiVersion: v1
data:
  ca.crt: "$(cat ca.crt | base64 --wrap=0)"
  tls.crt: "$(cat tls.crt | base64 --wrap=0)"
  tls.key: "$(cat tls.key | base64 --wrap=0)"
kind: Secret
metadata:
  name: tls-cert
type: Opaque
EOF
```

It will create a file cert-secret.yaml which contains k8s secret `tls-cert` for your certificates.

Now apply this secret in the namespace you want to have your ingress.

You can add this secret to tls section of your ingress.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    ingress.kubernetes.io/force-ssl-redirect: "true"
    ingress.kubernetes.io/rewrite-target: /
    kubernetes.io/ingress.class: nginx
  name: ingress-name
  namespace: ingress-namespace 
spec:
  backend:
    serviceName: svc-name
    servicePort: 80
  rules:
  - host: svc-name.namespace.domain
    http:
      paths:
      - backend:
          serviceName: svc-name
          servicePort: 80
        path: /
  tls:
  - hosts:
    - svc-name.namespace.domain
		secretName: secret-name
```

When you open the host, you can see the certificate.

You can also set the nginx-ingress-controller to use this cert by default, you need to add following args to nginx-ingress controller,

```yaml
extraArgs:
	annotations-prefix: ingress.kubernetes.io
	enable-dynamic-certificates: "false"
	enable-ssl-chain-completion: true
	default-ssl-certificate: "<namespace>/<tls-secret-name>"
```

If you have a wildcard certificate, you can add the same secret in all namespaces and refer that in the ingresses.

## Useful resources

https://www.terraform.io/intro/index.html

https://letsencrypt.org/docs/faq/

https://servicesblog.redhat.com/2019/03/15/dynamic-ssl-certificates-using-letsencrypt-on-openshift/