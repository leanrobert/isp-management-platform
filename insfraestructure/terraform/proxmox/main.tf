terraform {
  required_providers {
    proxmox = {
      source  = "Telmate/proxmox"
      version = "2.9.14"
    }
  }
}

provider "proxmox" {
  pm_api_url      = var.proxmox_url
  pm_user         = var.proxmox_user
  pm_password     = var.proxmox_password
  pm_tls_insecure = true
}

# ISP Management Server
resource "proxmox_vm_qemu" "isp_management" {
  name        = "isp-management"
  target_node = var.proxmox_node
  clone       = var.template_name
  os_type     = "cloud-init"

  cores   = 4
  memory  = 8192
  sockets = 1

  disk {
    size    = "50G"
    type    = "scsi"
    storage = var.storage_pool
  }

  network {
    model  = "virtio"
    bridge = "vmbr0"
  }

  ipconfig0 = "ip=${var.mgmt_ip}/24,gw=${var.gateway}"

  # Cloud-init configuration
  ciuser     = var.ssh_user
  cipassword = var.ssh_password
  sshkeys    = file(var.ssh_public_key)

  # Run Ansible after creation
  provisioner "local-exec" {
    command = <<-EOT
      sleep 60
      ansible-playbook -i ${var.mgmt_ip}, \
        --user ${var.ssh_user} \
        --private-key ${var.ssh_private_key} \
        -e "db_user=${var.db_user}" \
        -e "db_password=${var.db_password}" \
        -e "db_name=${var.db_name}" \
        ../ansible/playbooks/setup-isp.yml
    EOT
  }
}

# Monitoring Server
resource "proxmox_lxc" "monitoring" {
  hostname    = "isp-monitoring"
  target_node = var.proxmox_node
  ostemplate  = var.lxc_template
  password    = var.lxc_password

  cores  = 2
  memory = 4096

  rootfs {
    storage = var.storage_pool
    size    = "20G"
  }

  network {
    name   = "eth0"
    bridge = "vmbr0"
    ip     = "${var.monitoring_ip}/24"
    gw     = var.gateway
  }
}