variable "project_id" {
  type        = string
  description = "The GCP project ID"
}

variable "region" {
  type        = string
  description = "The region where resources will be created"
}

variable "environment_name" {
  type        = string
  description = "Environment name (e.g. dev, prod)"
}

variable "service_name" {
  type        = string
  description = "Cloud Run service name"
}

variable "container_image_url" {
  type        = string
  description = "Docker image URL for Cloud Run"
}
