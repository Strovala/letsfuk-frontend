npm run build
ssh root@euve258483.serverprofi24.net /bin/bash << EOF
    rm -rf /var/www/euve258483.serverprofi24.net
EOF
scp -r build root@euve258483.serverprofi24.net:/var/www/euve258483.serverprofi24.net

