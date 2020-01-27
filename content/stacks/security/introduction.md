# Introduction

A DevOps team may be accessing multiple applications and tools in a single product environment in support of their DevOps processes such as CI/CD server, Centralized log, Kubernetes dashboard, Monitoring software, Artifact repositories, Admin tools, etc. All of these tools will require authentication mechanisms for security purposes, and for a user to maintain and remember their authentication credentials on so many softwares can quickly become cumbersome. And in the event of lost credentials, it can be a tedious process for both user and admins to recover the required credentials.

Instead of having individual authentication on various tools, a more effective strategy is to use single sign-on for all tools, i.e. a centralized authentication mechanism that can allow or reject access to a set of tools based on a single set of credentials per user. Additionally some tools may not have authentication built into them at all, and may be reliant on an external authentication server in any case. An external authentication server with single sign-on capability can therefore prove to be the way to go in such a situation.

# Single Sign-On

Single Sign-On (SSO) allows users to log in using a single set of credentials, e.g. username and password, so they can easily access a set of applications. SSO. SSO saves time and energy for users because they do not have to repeatedly log into multiple applications. This provides a smooth user experience, and makes it less likely to have access problems because of lost or forgotten credentials, locked out accounts, etc.

# OpenID Connect

OIDC uses the Json Web Token (JWT) set of standards. There are really two types of use cases when using OIDC. Our relevant use case is where the application asks the Keycloak server to authenticate a user for them. After a successful login, the application will receive an identity token and an access token. The identity token contains information about the user such as username, email, and other profile information. The access token is digitally signed by the realm and contains access information, e.g. user roles, that the application can use to determine what resources the user is allowed to access on the application.