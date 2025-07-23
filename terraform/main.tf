provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_sql_database_instance" "mysql_instance" {
  name             = "mysql-instance"
  database_version = "MYSQL_8_0"
  region           = var.region

  settings {
    tier = "db-f1-micro"
  }
}

resource "google_sql_user" "default" {
  name     = var.db_user
  password = var.db_password
  instance = google_sql_database_instance.mysql_instance.name
}

resource "google_sql_database" "app_db" {
  name     = "app_db"
  instance = google_sql_database_instance.mysql_instance.name
}


resource "google_cloud_run_service" "springboot" {
  name     = "springboot-api"
  location = var.region

  template {
    spec {
      containers {
        image = var.docker_image
        ports {
          container_port = 8080
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

variable "docker_image" {
  description = "Docker image for Spring Boot app"
}