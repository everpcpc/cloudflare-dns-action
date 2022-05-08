# Create DNS Record Action for GitHub

Creates a new CloudFlare DNS record.

## Usage via Github Actions

Add [CLOUDFLARE_TOKEN](https://developers.cloudflare.com/api/tokens/create) and CLOUDFLARE_ZONE to the [repository secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

```yaml
- uses: everpcpc/cloudflare-dns-action@v1
  with:
    type: "A"
    name: "test.example.com"
    content: "8.8.8.8"
    ttl: 1
    proxied: true
    token: ${{ secrets.CLOUDFLARE_TOKEN }}
    zone: ${{ secrets.CLOUDFLARE_ZONE }}
```
**Use full qualified domain name to update if it exist**

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
