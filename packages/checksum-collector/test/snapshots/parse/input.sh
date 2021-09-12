#!/bin/bash -x
username="composer"

sudo useradd ${username} -u 2000 -G docker -s /bin/bash

conf_dir="conf"

cat << EOF > /etc/systemd/system/composer.service
[Unit]
    Description=Composer Service
    Requires=docker.service network-online.target
    After=docker.service network-online.target
    [Service]
    User=composer
    Environment="HOME=/home/composer/${conf_dir}"
    ExecStart=/usr/bin/docker run --rm -v  /var/run/docker.sock:/var/run/docker.sock -v "/home/composer/.docker:/root/.docker" -v "/home/composer:/home/composer" -w="/home/composer/${conf_dir}" docker/compose up -d
    ExecStop=/usr/bin/docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "/home/composer/.docker:/root/.docker" -v "/home/composer:/home/composer" -w="/home/composer/${conf_dir}" docker/compose rm -f
    Restart=on-failure
    RestartSec=10
    [Install]
    WantedBy=multi-user.target
EOF

sudo chmod 644 /etc/systemd/system/composer.service
sudo chown -R ${username}:${username} /home/${username}
sudo systemctl daemon-reload
sudo systemctl enable --now --no-block composer.service
sudo systemctl start composer.service


# The application log before datadog-agent is started is not sent to datadog-logging.
# So send it again.
sleep 30

ids=(`docker ps -f name=${conf_dir}_ -q |xargs`)
for id in "${ids[@]}"
do
    echo "==========="
    echo "id: $id"
    log_file="$id.log"
    docker logs $id > /tmp/${log_file}
    docker cp /tmp/${log_file}  $id:/tmp/${log_file}
    docker exec $id /bin/sh -c "cat /tmp/${log_file} >> /proc/1/fd/1"
done
