# mirrors-autoindex

Autoindex for UESTC Mirrors (Beta).

## Usage

### Clone

Please use `testing` branch for development and not for production until there is a `production` branch released.

### Example Nginx Config

Assume that:

- The data of mirror is at `/mirrors/data` directory.
- This project is cloned at `/var/www/mirrors-testing/.autoindex` directory.
- The status of mirror is placed at `/mirrors/status` directory.

Attention that:

- In this config, nginx use a reserve-proxy as the status. 
- This project is only at testing stage.

```nginx

        location ~ /.autoindex/ {
                root /var/www/mirrors-testing;
        }

        location ~* /.*/.+\.(htm?|txt|xml)$ {
                root /mirrors/data;
                add_after_body '';
                add_before_body '';
        }

        # ATTENTION Below config is only used at testing environment.  
        location ~ /status/ {
                # root /mirrors;
                proxy_pass http://mirrors.uestc.cn:80;
        }
        # END ATTENTION

        location / {
                root /mirrors/data;
                autoindex on;
                autoindex_localtime on;
                autoindex_exact_size off;
                add_before_body /.autoindex/header.html;
                add_after_body /.autoindex/footer.html;
                try_files $uri $uri/ =404;
        }

```

## TODO

- Custom view of every distribution page.
- More functions.
- Enhance UI.
