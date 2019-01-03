# Repository Structure

Following GitOps principles, We maintain a configuration repository that is separate from the code repository.
This means the build artifact from the code repository is reused across our different environments
such as staging and prod, and we can easily promote any particular build version by easily updating
our Configuration repo. In the case of a kubernetes based environment, the configuration repo will hold a yaml manifest 
where we can simply update the docker image version that should be used.