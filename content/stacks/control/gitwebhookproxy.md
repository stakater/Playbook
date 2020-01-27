# Gitwebhookproxy

## Introduction

[Gitwebhookproxy](https://github.com/stakater/GitWebhookProxy) is a proxy to let webhooks to reach a Jenkins instance running behind a firewall. Jenkins is awesome and matchless tool for both CI & CD; but unfortunately its a gold mine if left in wild with wide open access; so, we always want to put it behind a firewall. But when we put it behind firewall then webhooks don't work anymore, so we at stakater use gitwebhookproxy to bypass the firewall and trigger pipelines in jenkins.