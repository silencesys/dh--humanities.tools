/**
 * Computes a fuzzy match score for a query against a target string.
 * Returns -1 if no match found, otherwise a positive score (higher = better).
 */
function fuzzyScore(query, target) {
  if (!query || !target) return -1

  const q = query.toLowerCase()
  const t = target.toLowerCase()

  // Exact match
  if (t === q) return 1000

  // Substring match
  if (t.includes(q)) return 500

  // Fuzzy: all query characters must appear in order within target
  let qi = 0
  let score = 0
  let consecutive = 0

  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      score += 1 + consecutive * 2
      consecutive++
      qi++
    } else {
      consecutive = 0
    }
  }

  if (qi < q.length) return -1 // Not all query characters were found
  return score
}

/**
 * Fuzzy-searches resources against a query string.
 * Fields are checked in priority order: title (weight 3) → tags (weight 2) → description (weight 1).
 * Returns a filtered list sorted by relevance score.
 *
 * @param {string} query
 * @param {Array} resources
 * @returns {Array}
 */
export function fuzzySearch(query, resources) {
  if (!query || query.trim() === '') return resources

  const scored = resources.map((resource) => {
    const titleScore = fuzzyScore(query, resource.title)

    const tagsScore = Array.isArray(resource.tags) && resource.tags.length > 0
      ? Math.max(...resource.tags.map((tag) => fuzzyScore(query, tag)))
      : -1

    const descriptionScore = fuzzyScore(query, resource.description)

    const matched = titleScore >= 0 || tagsScore >= 0 || descriptionScore >= 0

    const weightedScore =
      (titleScore >= 0 ? titleScore * 3 : 0) +
      (tagsScore >= 0 ? tagsScore * 2 : 0) +
      (descriptionScore >= 0 ? descriptionScore * 1 : 0)

    return { resource, score: weightedScore, matched }
  })

  return scored
    .filter((item) => item.matched)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.resource)
}
