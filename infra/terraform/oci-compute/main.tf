terraform {
  required_version = ">= 1.3.0"

  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 6.0"
    }
  }
}

provider "oci" {
  config_file_profile = var.oci_config_profile
  region              = var.region
}

locals {
  app_name           = "optic-eyewear-calculator"
  allowed_cidrs      = distinct(concat([var.home_ip_cidr, var.mobile_ip_cidr], var.extra_allowed_cidrs))
  ssh_authorized_key = trimspace(var.ssh_public_key != "" ? var.ssh_public_key : file(pathexpand(var.ssh_public_key_path)))
  common_tags = {
    app        = local.app_name
    managed_by = "terraform"
  }
}

data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

data "oci_core_images" "app_image" {
  compartment_id           = var.compartment_ocid
  operating_system         = var.operating_system
  operating_system_version = var.operating_system_version
  shape                    = var.instance_shape
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

resource "oci_core_vcn" "app" {
  compartment_id = var.compartment_ocid
  display_name   = "${local.app_name}-vcn"
  cidr_block     = var.vcn_cidr
  dns_label      = "opticcalc"
  freeform_tags  = local.common_tags
}

resource "oci_core_internet_gateway" "app" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.app.id
  display_name   = "${local.app_name}-igw"
  enabled        = true
  freeform_tags  = local.common_tags
}

resource "oci_core_route_table" "public" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.app.id
  display_name   = "${local.app_name}-public-rt"
  freeform_tags  = local.common_tags

  route_rules {
    destination       = "0.0.0.0/0"
    destination_type  = "CIDR_BLOCK"
    network_entity_id = oci_core_internet_gateway.app.id
  }
}

resource "oci_core_security_list" "locked" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.app.id
  display_name   = "${local.app_name}-subnet-locked-sl"
  freeform_tags  = local.common_tags

  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
  }
}

resource "oci_core_subnet" "public" {
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.app.id
  display_name               = "${local.app_name}-public-subnet"
  cidr_block                 = var.public_subnet_cidr
  dns_label                  = "public"
  route_table_id             = oci_core_route_table.public.id
  security_list_ids          = [oci_core_security_list.locked.id]
  prohibit_public_ip_on_vnic = false
  freeform_tags              = local.common_tags
}

resource "oci_core_network_security_group" "app" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.app.id
  display_name   = "${local.app_name}-nsg"
  freeform_tags  = local.common_tags
}

resource "oci_core_network_security_group_security_rule" "ingress" {
  for_each = {
    for item in flatten([
      for cidr in local.allowed_cidrs : [
        for port in var.allowed_tcp_ports : {
          key  = "${cidr}-${port}"
          cidr = cidr
          port = port
        }
      ]
    ]) : item.key => item
  }

  network_security_group_id = oci_core_network_security_group.app.id
  direction                 = "INGRESS"
  protocol                  = "6"
  source                    = each.value.cidr
  source_type               = "CIDR_BLOCK"
  description               = "Allow TCP ${each.value.port} from ${each.value.cidr}"

  tcp_options {
    destination_port_range {
      min = each.value.port
      max = each.value.port
    }
  }
}

resource "oci_core_network_security_group_security_rule" "egress" {
  network_security_group_id = oci_core_network_security_group.app.id
  direction                 = "EGRESS"
  protocol                  = "all"
  destination               = "0.0.0.0/0"
  destination_type          = "CIDR_BLOCK"
  description               = "Allow outbound traffic for package installs and app updates"
}

resource "oci_core_instance" "app" {
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[var.availability_domain_index].name
  compartment_id      = var.compartment_ocid
  display_name        = local.app_name
  shape               = var.instance_shape
  freeform_tags       = local.common_tags

  shape_config {
    ocpus         = var.ocpus
    memory_in_gbs = var.memory_in_gbs
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.public.id
    display_name     = "${local.app_name}-vnic"
    assign_public_ip = true
    nsg_ids          = [oci_core_network_security_group.app.id]
  }

  source_details {
    source_type = "image"
    source_id   = data.oci_core_images.app_image.images[0].id
  }

  metadata = {
    ssh_authorized_keys = local.ssh_authorized_key
    user_data = base64encode(templatefile("${path.module}/templates/cloud-init.yaml.tftpl", {
      app_name           = local.app_name
      app_repository_url = var.app_repository_url
      app_branch         = var.app_branch
      app_port           = var.app_port
      server_name        = var.server_name
    }))
  }
}
