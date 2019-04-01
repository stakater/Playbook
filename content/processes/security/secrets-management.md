# Secrets Management

Sensitive information such as a database password or an API key should not be stored in clear text. And these should not be written into the container image. The 12-factor app philosophy says that configuration including secrets should come from the environment. Kubernetes provides the resource type Secrets for this. Kubernetes Secrets provide a mechanism to use such information in a safe and reliable way

- Secrets are namespaced objects, i.e. they exist in the context of a namespace
- You can access them via a volume or an environment variable from a container running in a pod
- The API server stores secrets as plaintext in etcd

Applying the Principle of Least Privilege, We want to ensure that containerized code can read only the secrets that it needs. And also a good idea is to have a different set of secrets for different environments (like production, development, and testing). The development and test credentials can be shared with a wider set of team members without necessarily giving them full access to the production credentials.

There are three ways to get secrets (or any other kind of information) into a container so that they are accessible to the application:

- Building them into the image itself
- Passing them into the container as environment variables
- Mounting a volume into a container so that code can read the information out of a file on that volume

You might be thinking that the container application could query secrets through some kind of network activity, but then the question arises: how do you stop that information from being available to bad actor entities without requiring credentials of some kind? Then those credentials are a secret that needs to be passed into the container first, and we are back to the set of three options.

Kubernetes secrets support the last two of these approaches, although the third option of mounting a volume is generally considered the safest.

Following GitOps principles, we would like to maintain our configuration and secrets in version control with respect to the relevant environment. However committing secrets into version control in plane text is not a good idea. But we still want them to be versioned and maintained with the environment configuration, and be accessible to multiple developers/ops or target systems.

For this we can commit encrypted secrets into our version control, and decrypt them when we need to use. This becomes easy when using Helm, since Helm has a plugin for this, Helm secrets.

Helm secrets:

- allows encryption of values, so that they can be checked into version control
- Track which secrets were changed at what time in the version control system
- Values files are encrypted with a secret key.
- The plugin supports the yaml structure encryption per value, i.e. it only encrypts the values