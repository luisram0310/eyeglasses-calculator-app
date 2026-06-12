# OCI Compute Deployment

Terraform stack for hosting the Optic Eyewear Claim Reconciliation App on an OCI
Compute VM with a public IP restricted to approved source IP addresses.

## What It Creates

- 1 VCN with a public subnet
- Internet Gateway and route table
- Locked-down subnet security list
- Network Security Group allowing only approved CIDRs to ports `22`, `80`, and
  `443`
- 1 Compute instance, pinned to `VM.Standard.A1.Flex` with `1` OCPU and `8` GB RAM
- Public IP on the instance
- Cloud-init bootstrap that installs Node.js 22, clones the app repo, builds it,
  runs it with systemd, and proxies traffic through Nginx

## Required Inputs

Create a local `terraform.tfvars` file in this folder:

```hcl
tenancy_ocid     = "ocid1.tenancy.oc1.."
compartment_ocid = "ocid1.compartment.oc1.."
home_ip_cidr     = "YOUR_HOME_PUBLIC_IP/32"
```

By default, `166.205.97.28/32` is also allowed. If your current computer is on
a different public IP than your home connection, add it as an extra allowed
source:

```hcl
extra_allowed_cidrs = ["YOUR_CURRENT_PUBLIC_IP/32"]
```

## Commands

```bash
terraform init
terraform plan
terraform apply
```

After apply finishes, Terraform prints the VM public IP, app URL, and SSH command.

## Notes

- The VM is intentionally limited to `1` OCPU and `8` GB RAM.
- The default SSH public key path is `~/.ssh/ebs_rsa.pub`.
- The app repo defaults to
  `https://github.com/luisram0310/eyeglasses-calculator-app.git`.
- Do not commit `terraform.tfvars` or Terraform state files.
