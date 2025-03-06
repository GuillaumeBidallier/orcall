remote_state {
  backend = "gcs"
  config = {
    bucket   = "orcall-terraform-state"
    prefix   = "prod/front"
    project  = "orcall"
    location = "europe-west1"
  }
}

inputs = {
  project_id   = "orcall"
  region       = "europe-west1"
  service_name = "client"
}
