variable "project_name" {
  default = "bookstore"
}

variable "aws_region" {
  default = "us-east-1"
}

variable "vpc_cidr" {
  default = "10.10.0.0/16"
}

variable "frontend_image" {
  description = "ECR image URI for frontend"
}

variable "backend_image" {
  description = "ECR image URI for backend"
}

variable "mongodb_atlas_uri" {
  description = "MongoDB Atlas connection string"
}

variable "jwt_secret" {
  description = "JWT secret"
}
