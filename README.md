# Create DNS Record Action for GitHub

Creates a new CloudFlare DNS record.
forked from everpcpc/cloudflare-dns-action@v1 to fix https://github.blog/changelog/2022-10-11-github-actions-deprecating-save-state-and-set-output-commands/

## Inputs

### `type`

DNS record type. Default `A`

### `name`

**Required** DNS record name

**Use full qualified domain name to update if it exist**

### `content`

**Required** DNS record content

### `ttl`

Time to live for DNS record. Default `1` for auto.

### `proxied`

Whether the record is receiving the performance and security benefits of Cloudflare. Default: `true`

### `token`

**Required** CloudFlare API token

### `zone`

**Required** CloudFlare zone

## Outputs

### `record_id`

Record ID

### `name`

Affected domain name

## Example usage

Add [CLOUDFLARE_TOKEN](https://developers.cloudflare.com/api/tokens/create) and CLOUDFLARE_ZONE to the [repository secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets).

```yaml
- uses: ezraroda/cloudflare-dns-action@v1
  with:
    type: "A"
    name: "test.example.com"
    content: "8.8.8.8"
    ttl: 1
    proxied: false
    token: ${{ secrets.CLOUDFLARE_TOKEN }}
    zone: ${{ secrets.CLOUDFLARE_ZONE }}
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
