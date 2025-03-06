variable "project_id" {}
variable "service_name" {}
variable "environment_name" {}

resource "google_service_account" "cloud_run_sa" {
  project      = var.project_id
  account_id   = "${var.environment_name}-${var.service_name}"
  display_name = "Service Account for Cloud Run for ${var.environment_name}-${var.service_name}"
}

output "cloud_run_service_account_email" {
  value = google_service_account.cloud_run_sa.email
}