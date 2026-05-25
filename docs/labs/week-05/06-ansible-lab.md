# Lab 06 — Ansible Provisioning

**Prerequisites:** EC2 running, SSH access works.  
**Goal:** Write inventory + playbook that configures the server.

---

## Checkpoint 1 — Install Ansible

```bash
pip install ansible
cd ansible
ansible-galaxy collection install -r requirements.yml
```

**FILE:** `ansible/requirements.yml`

```yaml
---
collections:
  - name: community.docker
    version: ">=3.0.0"
```

---

## Checkpoint 2 — inventory.ini

**FILE:** `ansible/inventory.ini`

```ini
[app_servers]
app ansible_host=YOUR_EC2_PUBLIC_IP ansible_user=ubuntu

[app_servers:vars]
ansible_ssh_private_key_file=~/.ssh/your-key.pem
project_dir=/home/ubuntu/product-review-tracker
```

**RUN test:**

```bash
ansible -i inventory.ini app_servers -m ping
```

**EXPECTED:** `pong`

---

## Checkpoint 3 — playbook.yml

**FILE:** `ansible/playbook.yml`

```yaml
---
- name: Provision Product Review Tracker on EC2
  hosts: app_servers
  become: true
  vars:
    repo_url: https://github.com/YOUR_USERNAME/product-review-tracker.git

  tasks:
    - name: Ensure Docker is running
      service:
        name: docker
        state: started
        enabled: true

    - name: Clone or update application repository
      become_user: ubuntu
      git:
        repo: "{{ repo_url }}"
        dest: "{{ project_dir }}"
        version: main
        force: true
      register: git_result

    - name: Copy environment file if missing
      become_user: ubuntu
      copy:
        src: "{{ project_dir }}/.env.example"
        dest: "{{ project_dir }}/.env"
        remote_src: true
        force: false

    - name: Start application with Docker Compose
      become_user: ubuntu
      community.docker.docker_compose_v2:
        project_src: "{{ project_dir }}"
        state: present
        pull: always
      environment:
        HOME: /home/ubuntu

    - name: Wait for API health check
      uri:
        url: "http://localhost:8000/health"
        status_code: 200
      register: health
      retries: 10
      delay: 5
      until: health.status == 200
```

**RUN:**

```bash
ansible-playbook -i inventory.ini playbook.yml
```

**EXPECTED:** All tasks `ok` or `changed`, health check passes.

**EXPLANATION:** `become: true` = run as root where needed; `become_user: ubuntu` for app files.

**Next:** [Week 6 — Monitoring](../week-06/07-monitoring-lab.md)
