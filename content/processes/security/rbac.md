# Role Based Access Control (RBAC)

RBAC is a method of regulating access to computer or network resources based on the roles of individual users. All resources are modeled API objects in Kubernetes, belonging to API Groups. These resources allow operations such as Create, Read, Update, and Delete (CRUD). RBAC is writing rules to allow or deny operations on resources by users, roles or groups.

Rules are operations which can act upon an API group.

- Roles are a group of rules which affect, or scope, a single namespace
  - ClusterRoles have a scope of the entire cluster.
- Each operation can act upon one of three subjects
  - User Accounts
  - Service Accounts
  - Groups

Here is a summary of the RBAC process:

1. Determine or create namespace
2. Create certificate credentials for user
3. Set the credentials for the user to the namespace using a context
4. Create a role for the expected task set
5. Bind the user to the role
6. Verify the user has limited access.