output "instance_id" {
  value = oci_core_instance.app.id
}

output "public_ip" {
  value = oci_core_instance.app.public_ip
}

output "app_url" {
  value = "http://${oci_core_instance.app.public_ip}"
}

output "ssh_command" {
  value = "ssh -i ${var.ssh_private_key_path} opc@${oci_core_instance.app.public_ip}"
}
