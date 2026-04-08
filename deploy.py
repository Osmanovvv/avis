"""Deploy script for AVIS site to production server."""
import paramiko
import os

HOST = '159.194.201.36'
USER = 'root'
PASS = 'kyiz4Dga9H&l'
REMOTE = '/var/www/avis'
DIST = os.path.join(os.path.dirname(__file__), 'dist')
API_LOCAL = os.path.join(os.path.dirname(__file__), 'api')

# Server-only secrets (not in git)
ENV_PHP = """<?php
putenv('DB_HOST=localhost');
putenv('DB_NAME=avis');
putenv('DB_USER=avis');
putenv('DB_PASS=avis_db_pass_2026');
putenv('ADMIN_PASSWORD=admin');
putenv('JWT_SECRET=avis_prod_jwt_secret_2026');
putenv('TG_BOT_TOKEN=8785008496:AAHTZxtePbwJ6R2FMgPQni5YtXoJ6XTU9nQ');
putenv('TG_CHAT_ID=1108419534');
"""


def deploy():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, username=USER, password=PASS, timeout=15)
    sftp = ssh.open_sftp()

    print("1. Preserving uploads and .env.php...")
    # Save uploads list and .env.php (don't touch them)
    # We only remove frontend files, not API uploads

    print("2. Removing old frontend files (keeping api/uploads)...")
    # Remove everything except api/uploads and api/.env.php
    # Remove only frontend files (assets, fonts, html, etc) - NOT api folder
    ssh.exec_command(f'find {REMOTE} -maxdepth 1 -not -name "api" -not -path "{REMOTE}" -exec rm -rf {{}} +')[1].read()

    print("3. Uploading dist/...")
    count = 0
    def upload_dir(local, remote):
        nonlocal count
        for item in os.listdir(local):
            lp = os.path.join(local, item)
            rp = remote + '/' + item
            if os.path.isdir(lp):
                try:
                    sftp.mkdir(rp)
                except:
                    pass
                upload_dir(lp, rp)
            else:
                sftp.put(lp, rp)
                count += 1

    upload_dir(DIST, REMOTE)
    print(f"   Uploaded {count} frontend files")

    print("4. Updating API PHP files...")
    for f in os.listdir(API_LOCAL):
        if f.endswith('.php') and f != '.env.php':
            local_path = os.path.join(API_LOCAL, f)
            remote_path = f'{REMOTE}/api/{f}'
            sftp.put(local_path, remote_path)
            print(f"   Updated {f}")

    # Upload .htaccess for API
    htaccess = os.path.join(API_LOCAL, '.htaccess')
    if os.path.exists(htaccess):
        sftp.put(htaccess, f'{REMOTE}/api/.htaccess')
        print("   Updated .htaccess")

    print("5. Writing .env.php with secrets...")
    with sftp.open(f'{REMOTE}/api/.env.php', 'w') as f:
        f.write(ENV_PHP)

    print("6. Ensuring uploads dir exists with correct permissions...")
    ssh.exec_command(f'mkdir -p {REMOTE}/api/uploads')[1].read()
    ssh.exec_command(f'chown -R www-data:www-data {REMOTE}/api/uploads/')[1].read()

    print("7. Setting schema.sql...")
    schema = os.path.join(API_LOCAL, 'schema.sql')
    if os.path.exists(schema):
        sftp.put(schema, f'{REMOTE}/api/schema.sql')

    sftp.close()
    ssh.close()
    print("\nDeploy complete!")


if __name__ == '__main__':
    deploy()
