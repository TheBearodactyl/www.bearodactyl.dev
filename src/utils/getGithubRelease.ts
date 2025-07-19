export async function getGithubRelease(
  owner: string,
  repo: string,
  file: string,
  version: string = 'v1.0.0',
): Promise<Blob> {
  const releaseUrl: string = `https://github.com/${owner}/${repo}/releases/download/${version}/${file}`
  const proxyUrl: string = `https://corsproxy.io/?url=${encodeURIComponent(releaseUrl)}`

  try {
    const res: Response = await fetch(proxyUrl)
    console.log(res.json())

    return (await fetch(proxyUrl)).blob()
  } catch (err) {
    console.error('Error fetching GitHub release via proxy:', err)
    throw err instanceof Error ? err : new Error(String(err))
  }
}
