# Using TLS with Custom Certificate

## Creating Certificate

You can create a certificate yourself and have a ca.crt, tls.crt and tls.key files with you. However, we create certificate through terraform and LetsEncrypt using Acme. For that refer to `terraform-aws-openshift` repo and see the certs/ folder. You can change the variables there and run the terraform script using `terraform apply`. It will give three outputs which you can map to following files:

- ca.crt  ->  public_certificate_intermediate_pem
- tls.crt ->  public_certificate_pem
- tls.key ->  public_certificate_key

Now create a secret file, by running following command

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
