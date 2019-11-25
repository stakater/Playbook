# Sealed Secret Permission

## Overview

Currently, the sealed secret default rbac is being used that gives minimum permission to the sealed secret controller. It create role and clusterRole for it.

## Issue

In the current verion

```
Chart Version: 1.6.0
Image Version: V0.9.5
```

We disabled the default rbac and give is a role for the current namespace but its controller still wants the rbac at the clusterlevel.

Therefore default rbac has been enabled.


##  Multi-tenant environment

Currently, Sealed secret has the cluster role so therefore it watches all the namespaces.
