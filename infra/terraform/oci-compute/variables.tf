variable "oci_config_profile" {
  description = "OCI CLI config profile to use."
  type        = string
  default     = "DEFAULT"
}

variable "region" {
  description = "OCI region."
  type        = string
  default     = "us-ashburn-1"
}

variable "tenancy_ocid" {
  description = "Tenancy OCID, used to look up availability domains."
  type        = string
}

variable "compartment_ocid" {
  description = "Compartment OCID where resources will be created."
  type        = string
}

variable "home_ip_cidr" {
  description = "Home computer public IP as a /32 CIDR, for example 198.51.100.20/32."
  type        = string

  validation {
    condition     = can(cidrhost(var.home_ip_cidr, 0))
    error_message = "home_ip_cidr must be a valid CIDR block such as 198.51.100.20/32."
  }
}

variable "mobile_ip_cidr" {
  description = "Second approved source IP CIDR."
  type        = string
  default     = "166.205.97.28/32"

  validation {
    condition     = can(cidrhost(var.mobile_ip_cidr, 0))
    error_message = "mobile_ip_cidr must be a valid CIDR block."
  }
}

variable "extra_allowed_cidrs" {
  description = "Additional source CIDRs allowed to reach SSH/HTTP/HTTPS."
  type        = list(string)
  default     = []
}

variable "allowed_tcp_ports" {
  description = "TCP ports allowed from approved source CIDRs."
  type        = list(number)
  default     = [22, 80, 443]
}

variable "vcn_cidr" {
  description = "VCN CIDR block."
  type        = string
  default     = "10.42.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Public subnet CIDR block."
  type        = string
  default     = "10.42.1.0/24"
}

variable "availability_domain_index" {
  description = "Index of the availability domain to use."
  type        = number
  default     = 0
}

variable "instance_shape" {
  description = "OCI compute shape."
  type        = string
  default     = "VM.Standard.A1.Flex"
}

variable "ocpus" {
  description = "OCPUs for the flexible shape. This stack is intentionally pinned to one small VM."
  type        = number
  default     = 1

  validation {
    condition     = var.ocpus == 1
    error_message = "This stack is intentionally limited to 1 OCPU."
  }
}

variable "memory_in_gbs" {
  description = "Memory in GB for the flexible shape. This stack is intentionally pinned to 8 GB."
  type        = number
  default     = 8

  validation {
    condition     = var.memory_in_gbs == 8
    error_message = "This stack is intentionally limited to 8 GB RAM."
  }
}

variable "operating_system" {
  description = "Image operating system."
  type        = string
  default     = "Oracle Linux"
}

variable "operating_system_version" {
  description = "Image operating system version."
  type        = string
  default     = "9"
}

variable "ssh_public_key" {
  description = "SSH public key content. If empty, ssh_public_key_path is used."
  type        = string
  default     = ""
}

variable "ssh_public_key_path" {
  description = "Local path to SSH public key for instance access."
  type        = string
  default     = "~/.ssh/ebs_rsa.pub"
}

variable "ssh_private_key_path" {
  description = "Local path to SSH private key, used only for the ssh_command output."
  type        = string
  default     = "~/.ssh/ebs_rsa"
}

variable "app_repository_url" {
  description = "Git repository URL cloned by cloud-init."
  type        = string
  default     = "https://github.com/luisram0310/eyeglasses-calculator-app.git"
}

variable "app_branch" {
  description = "Git branch to deploy."
  type        = string
  default     = "main"
}

variable "app_port" {
  description = "Local app port behind Nginx."
  type        = number
  default     = 3000
}

variable "server_name" {
  description = "Nginx server_name. Use '_' for IP-only access."
  type        = string
  default     = "_"
}
