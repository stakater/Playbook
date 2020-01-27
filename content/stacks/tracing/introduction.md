# Introduction

Tracing is one of the pillars of observability. We use [Istio](https://github.com/istio/istio) for tracing. It tracks a user request through multiple services and enables the end user to get a deeper understanding of a request routing.

We are currently using [Istio Operator](https://github.com/istio/operator) to deploy istio components. Istio consists of following services:


* Envoy(sidecar container) : It is a high-performance proxy developed in C++ to mediate all inbound and outbound traffic for all services in the service mesh.

* Jaeger: It is an open source end-to-end distributed tracing system. 

* Mixer: It is part of Istio's Control Plane. Mixer enforces access control and usage policies across the service mesh, and collects telemetry data from the Envoy proxy and other services. The proxy extracts request level attributes, and sends them to Mixer for evaluation.

* Pilot: Pilot provides service discovery for the Envoy sidecars, traffic management capabilities for intelligent routing (e.g., A/B tests, canary rollouts, etc.), and resiliency (timeouts, retries, circuit breakers, etc).
