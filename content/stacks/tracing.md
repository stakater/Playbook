# Tracing Stack

Tracing Stack includes applications that create mesh of services and provide traces  for the communication between mesh components.

## Tools Matrix




|          Tool         |                            Chart Repository                                      | Cherry Pickable | SSO | Pre-Requisites |
| :-------------------: | :------------------------------------------------------------------------------: | :--------------:| :--:| :-------------:|
| [Istio](https://istio.io/docs/reference/config/installation-options/)         | [Public](https://gcsweb.istio.io/gcs/istio-prerelease/prerelease/1.1.0/1.1.0/charts/)                                 |       Yes       | N/A |      None      |

We are using this one helm chart to deploy all the tracing components:

* Istio: It is an open platform for providing a uniform way to integrate microservices, manage traffic flow across microservices, enforce policies and aggregate telemetry data.

* Citadel: It is part of Istio's Control Plane. Citadel enables strong service-to-service and end-user authentication with built-in identity and credential management. 

* Envoy(sidecar container) : It is a high-performance proxy developed in C++ to mediate all inbound and outbound traffic for all services in the service mesh.

* Jaeger: It is an open source end-to-end distributed tracing system. 

* Mixer: It is part of Istio's Control Plane. Mixer enforces access control and usage policies across the service mesh, and collects telemetry data from the Envoy proxy and other services. The proxy extracts request level attributes, and sends them to Mixer for evaluation.

* Pilot: Pilot provides service discovery for the Envoy sidecars, traffic management capabilities for intelligent routing (e.g., A/B tests, canary rollouts, etc.), and resiliency (timeouts, retries, circuit breakers, etc).