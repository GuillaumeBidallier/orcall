include {
  path = find_in_parent_folders("root.hcl")
}

inputs = {
  environment_name    = "dev"
  container_image_url = get_env("CONTAINER_IMAGE_URL")
  dns_name            = "orcall.fr"
}
