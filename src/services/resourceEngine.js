export function generateLink(resource) {
  if (!resource || !resource.title) return "#";
  
  const platformStr = (resource.platform || "").toLowerCase();
  const searchStr = encodeURIComponent(resource.title);
  const contextStr = encodeURIComponent(`${resource.title} ${resource.platform || ""}`.trim());

  switch (true) {
    case platformStr.includes('youtube'):
      return `https://www.youtube.com/results?search_query=${searchStr}`;
    case platformStr.includes('coursera'):
      return `https://www.coursera.org/search?query=${searchStr}`;
    case platformStr.includes('goodreads'):
    case platformStr.includes('book'):
      return `https://www.goodreads.com/search?q=${searchStr}`;
    case platformStr.includes('udemy'):
      return `https://www.udemy.com/courses/search/?q=${searchStr}`;
    case platformStr.includes('edx'):
      return `https://www.edx.org/search?q=${searchStr}`;
    default:
      // Fallback to a google search incorporating the platform to find articles/blogs
      return `https://www.google.com/search?q=${contextStr}`;
  }
}

export function attachLinksToRoadmap(roadmap) {
  if (!roadmap || !roadmap.phases) return roadmap;

  const newPhases = roadmap.phases.map(phase => {
    if (!phase.topics) return phase;

    const newTopics = phase.topics.map(topic => {
      // If AI forgot resources array, return plain topic
      if (!Array.isArray(topic.resources)) return topic;

      const enhancedResources = topic.resources.map(res => ({
        ...res,
        url: generateLink(res)
      }));

      return {
        ...topic,
        resources: enhancedResources
      };
    });

    return {
      ...phase,
      topics: newTopics
    };
  });

  return {
    ...roadmap,
    phases: newPhases
  };
}
