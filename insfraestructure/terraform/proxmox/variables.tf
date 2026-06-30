variable "proxmox_url" {
  description = "Proxmox API URL"
  type        = string
}

variable "proxmox_user" {
  description = "Proxmox username"
  type        = string
}

variable "proxmox_password" {
  description = "Proxmox password"
  type        = string
  sensitive   = true
}

variable "proxmox_node" {
  description = "Proxmox node name"
  type        = string
  default     = "pve"
}

variable "template_name" {
  description = "VM template to clone"
  type        = string
}

variable "storage_pool" {
  description = "Storage pool for VMs"
  type        = string
  default     = "local-lvm"
}

variable "mgmt_ip" {
  description = "IP for management server"
  type        = string
}

variable "monitoring_ip" {
  description = "IP for monitoring container"
  type        = string
}

variable "gateway" {
  description = "Network gateway"
  type        = string
}

variable "ssh_user" {
  description = "SSH username"
  type        = string
  default     = "admin"
}

variable "ssh_password" {
  description = "SSH password"
  type        = string
  sensitive   = true
}

variable "ssh_public_key" {
  description = "Path to SSH public key"
  type        = string
}

variable "ssh_private_key" {
  description = "Path to SSH private key"
  type        = string
}

variable "db_user" {
  description = "Database username"
  type        = string
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "isp_management"
}

variable "lxc_template" {
  description = "LXC template"
  type        = string
}

variable "lxc_password" {
  description = "LXC root password"
  type        = string
  sensitive   = true
}