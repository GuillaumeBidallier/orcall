terraform {
  backend "gcs" {}
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.24"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.24"
    }
  }
}

module "cloud_run_sa" {
  source           = "../../modules/cloud-run-service-account"
  project_id       = var.project_id
  service_name     = var.service_name
  environment_name = var.environment_name
}

module "cloud_run" {
  source                = "../../modules/cloud-run"
  project_id            = var.project_id
  region                = var.region
  environment_name      = var.environment_name
  service_name          = var.service_name
  container_image       = var.container_image_url
  service_account_email = module.cloud_run_sa.cloud_run_service_account_email
  dns_name              = var.dns_name
  env = {
  }
}
