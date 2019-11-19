# Scenario

We will be updating Nordmart and adding a Review Microservice so that reviews can be shown of products.

## Previous Architecture & UI

This was the previous architecture of the application.

```
                              +-------------+
                              |             |
                              |     Web     |
                              |             |
                              |   Node.js   |
                              |  AngularJS  |
                              +------+------+
                                     |
                                     v
                              +------+------+
                              |             |
                              | API Gateway |
                              |             |
                              |   Vert.x    |
                              |             |
                              +------+------+
                                     |
                 +---------+---------+-------------------+
                 v                   v                   v
          +------+------+     +------+------+     +------+------+
          |             |     |             |     |             |
          |   Catalog   |     |  Inventory  |     |     Cart    |
          |             |     |             |     |             |
          | Spring Boot |     |WildFly Swarm|     | Spring Boot |
          |             |     |             |     |             |
          +------+------+     +-------------+     +-------------+
```

### View

 ![Diagram](./image/home.png)


 ## Updated Architecture & UI

This is now the updated architecture for the application with review service added.

```
                                +-------------+
                                |             |
                                |     Web     |
                                |             |
                                |   Node.js   |
                                |  AngularJS  |
                                +------+------+
                                        |
                                        v
                                +------+------+
                                |             |
                                | API Gateway |
                                |             |
                                |   Vert.x    |
                                |             |
                                +------+------+
                                        |
            +---------+---------+-------------------+--------------------+
            v                   v                   v                    v
    +------+------+     +------+------+     +------+------+       +------+--------+
    |             |     |             |     |             |       |               |
    |   Catalog   |     |  Inventory  |     |     Cart    |       |   Review      |
    |             |     |             |     |             |       |               |
    | Spring Boot |     |WildFly Swarm|     | Spring Boot |       |   Spring Boot | 
    |             |     |             |     |             |       |               |
    +------+------+     +-------------+     +-------------+       +---------------+
```





### Updated View

 ![Diagram](./image/updated-view.png)

## Working

Now we will be creating PRs to implement above scenario. Following changes will be made to code:

- Review Service will be added
- Gateway will allow Review Service Endpoints
- Web will incorporate those changes in UI

So we will be making changes in the above services. We have already created branches in the above services repositories. The leads can guide their teams to create PRs, and as PRs get created, their pipelines will be triggered and a new image will be published for PR case.

Flux will look for the new image and update services in dev environment for Gateway & Web. You will have to add the review service manifest in `nordmart-dev-apps` repository. 

Once changes are in place for Dev Environment, you can confirm them and approve the PR and merge it, and the master pipeline will be triggered which will in end publish an image in semantic version.

Now you can use that version and update in `nordmart-prod-apps` repository for changes to occur. Again you will have to add review-service manifest in `nordmart-prod-apps` repo. Create a PR and the pipeline will run and dry run the components. Once passed, you can merge the PR to master, and `nordmart-prod-apps` master pipeline will run and it will deploy the latest changes to your prod environment.
