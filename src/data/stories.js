// src/data/stories.js

const episodeModules = import.meta.glob("./episodes/episode*.js", {
  eager: true,
})

export const stories = Object.values(episodeModules)
  .map((module) => module.default)
  .sort((a, b) => a.episode - b.episode)