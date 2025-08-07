<script>
    import Seo from "../../components/SEO.svelte";
    import SigmaPre from "../../components/SigmaPre.svelte";
    import { _ } from "svelte-i18n";
</script>

<Seo
    title="The Motherfucking Software License"
    desc="my custom software license"
    url="https://bearodactyl.dev/license"
    image="https://d2zia2w5autnlg.cloudfront.net/188090/6399590be3b9c-large"
/>

<SigmaPre>
    <pre>{$_("paragraphs.license.line-one")}
{$_("paragraphs.license.line-two")}
{$_("paragraphs.license.line-three")}
{$_("paragraphs.license.line-four")}</pre>
</SigmaPre>

<p class="footer">{$_("paragraphs.license.footer")}</p>

<style>
    .footer {
        margin-top: 5rem;
        margin-bottom: 1rem;
        text-align: center;
        color: var(--rp-highlight-high);
    }
</style>
