# victorkambi.com

Victor Kambi's portfolio, built with Astro.

## Development

```sh
pnpm install
pnpm dev
```

## Build

```sh
pnpm build
pnpm preview
```

## Deployment

The `Deploy to GitHub Pages` workflow builds `dist/` and deploys it whenever a
commit lands on `main`. It can also be started manually from the Actions tab.

Before the first deployment, configure the `victorkambi/victorkambi.com`
repository in GitHub:

1. Under **Settings → Pages**, choose **GitHub Actions** as the build and
   deployment source.
2. Push to `main` and check the site at its default Pages URL.
3. For the domain cutover, remove `victorkambi.com` from the old Pages
   repository, then set it as this repository's custom domain. Keep the old
   `victorkambi.github.io` Pages site enabled; it will serve the immediate meta
   refresh after the domain is moved.

GitHub Pages custom domains for custom Actions workflows are configured in
repository settings; a `CNAME` file is not used by this workflow. Keep the
Cloudflare DNS records for the apex domain pointed at GitHub Pages. If changing
those records, use GitHub's current apex-domain A/AAAA targets and leave DNS
proxying off until the Pages certificate is issued. The deployment URL shown
in the workflow environment is the Pages address for the site.
