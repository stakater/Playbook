{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "playbook.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "playbook.labels.selector" -}}
app: {{ template "playbook.name" . }}
group: {{ .Values.playbook.labels.group }}
provider: {{ .Values.playbook.labels.provider }}
{{- end -}}

{{- define "playbook.labels.stakater" -}}
{{ template "playbook.labels.selector" . }}
version: "{{ .Values.playbook.labels.version }}"
{{- end -}}

{{- define "playbook.labels.chart" -}}
chart: "{{ .Chart.Name }}-{{ .Chart.Version }}"
release: {{ .Release.Name | quote }}
heritage: {{ .Release.Service | quote }}
{{- end -}}
