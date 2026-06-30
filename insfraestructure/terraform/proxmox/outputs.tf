output "management_server_ip" {
  description = "IP of the management server"
  value       = proxmox_vm_qemu.isp_management.default_ipv4_address
}

output "monitoring_container_ip" {
  description = "IP of the monitoring container"
  value       = proxmox_lxc.monitoring.network[0].ip
}