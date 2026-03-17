const HASHNODE_API = "https://gql.hashnode.com";
const HASHNODE_HOST = "iceybubble.hashnode.dev";

export async function getHashnodeBlogs() {
  const query = `
    query Publication($host: String!) {
      publication(host: $host) {
        posts(first: 12) {
          edges {
            node {
              title
              brief
              url
              slug
              publishedAt
              coverImage {
                url
              }
              tags {
                name
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(HASHNODE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        variables: { host: HASHNODE_HOST },
      }),
      next: { revalidate: 3600 },
    });

    const json = await res.json();

    if (json?.errors) {
      console.error("Hashnode API errors:", json.errors);
      return [];
    }

    const edges = json?.data?.publication?.posts?.edges ?? [];

    return edges.map((e, idx) => ({
      id: idx + 1,
      title: e?.node?.title ?? "",
      description: e?.node?.brief ?? "",
      image: e?.node?.coverImage?.url ?? "",
      publishedAt: e?.node?.publishedAt ?? "",
      url: e?.node?.url ?? "",
      tags: (e?.node?.tags ?? []).map((t) => t.name),
    }));
  } catch (err) {
    console.error("Hashnode fetch failed:", err);
    return [];
  }
}

// Some parts of the template might import `blogs` directly.
// Keep it exported to avoid breaking imports.
export const blogs = [];