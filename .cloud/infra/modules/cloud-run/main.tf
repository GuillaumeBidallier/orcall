variable "project_id" {}
variable "region" {}
variable "environment_name" {}
variable "service_name" {}
variable "service_account_email" {}
variable "container_image" {}
variable "env" {
  type = map(string)
}
variable "dns_name" {}

data "google_cloud_run_v2_service" "server" {
  project  = var.project_id
  name     = "${var.environment_name}-server"
  location = var.region
}

resource "google_cloud_run_v2_service" "this" {
  name     = "${var.environment_name}-${var.service_name}"
  project  = var.project_id
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      max_instance_count = 2
    }

    service_account = var.service_account_email

    containers {
      image = var.container_image

      env {
        name  = "NEXT_PUBLIC_BACKEND_URL"
        value = data.google_cloud_run_v2_service.server.uri
      }

      dynamic "env" {
        for_each = var.env
        content {
          name  = env.key
          value = env.value
        }
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# Une permission pour que le service soit public
resource "google_cloud_run_v2_service_iam_member" "public" {
  location = var.region
  project  = var.project_id
  role     = "roles/run.invoker"
  member   = "allUsers"
  name     = google_cloud_run_v2_service.this.name
}

resource "google_cloud_run_domain_mapping" "front_domain_mapping" {
  name     = var.dns_name
  location = var.region
  project  = var.project_id

  metadata {
    namespace = var.project_id
  }

  spec {
    route_name = google_cloud_run_v2_service.this.name
  }
}

output "domain_mapping_status" {
  value = google_cloud_run_domain_mapping.front_domain_mapping.status
}

output "url" {
  value = google_cloud_run_v2_service.this.uri
}