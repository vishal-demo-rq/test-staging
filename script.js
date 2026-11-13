const stories = [
  {
    title: "The quiet magic of small rituals",
    category: "Slow living",
    date: "June 12, 2025",
    readTime: "5 min read",
    excerpt: "A few familiar moments can turn an ordinary day into something worth keeping.",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=85",
    alt: "A sunlit coffee shop with a quiet table by the window",
    content: [
      "There is comfort in doing one small thing the same way each day.",
      "Make tea before the house wakes, open a notebook at the same corner of the table,",
      "or take the long way home because the light is nice.",
      "A ritual does not need to be grand to matter.",
      "Give one moment a little room, and let it be enough on its own."
    ].join(" ")
  },
  {
    title: "A walk is a creative practice",
    category: "Creativity",
    date: "June 8, 2025",
    readTime: "4 min read",
    excerpt: "The best ideas rarely arrive on command. Sometimes they find you halfway down a familiar street.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85",
    alt: "A quiet path through a green landscape",
    content: [
      "When a problem feels too close, changing your surroundings can change the way you see it.",
      "Notice the details you usually pass by: a crooked sign, the sound of someone",
      "practicing piano, the way afternoon settles on a brick wall.",
      "Bring a question on your walk, and leave enough space for the answer to surprise you."
    ].join(" ")
  },
  {
    title: "On learning to read slowly again",
    category: "Culture",
    date: "June 3, 2025",
    readTime: "6 min read",
    excerpt: "A gentle case for fewer tabs, longer chapters, and letting a good sentence stay with you.",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=85",
    alt: "Warm afternoon light falling across shelves of books",
    content: [
      "Somewhere along the way, reading became another thing to get through.",
      "Slowing down is not about finishing more books. It is about letting an idea linger",
      "long enough to find its place in your own life.",
      "Try leaving your phone in another room and reading for ten unmeasured minutes.",
      "Stop wherever you are when the time is up."
    ].join(" ")
  },
  {
    title: "Making room for a good-enough day",
    category: "Slow living",
    date: "May 21, 2025",
    readTime: "3 min read",
    excerpt: "Not every day needs a breakthrough. Ordinary can be a lovely place to land.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85",
    alt: "A calm, sunlit neighborhood storefront",
    content: [
      "A day can be worthwhile without being memorable. The errands got done,",
      "lunch was simple, and nothing particularly remarkable happened.",
      "When every moment has to become a milestone, the quiet parts start to feel like they are waiting for something else.",
      "Let one thing be unfinished today, and call the day good anyway."
    ].join(" ")
  },
  {
    title: "A small guide to noticing the light",
    category: "Creativity",
    date: "May 15, 2025",
    readTime: "4 min read",
    excerpt: "A window, a sidewalk, the last hour of afternoon: paying attention changes a place.",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85",
    alt: "Golden evening sunlight spreading over a quiet field",
    content: [
      "Light changes a familiar place without moving a single thing.",
      "It softens the corner you have walked past all week and turns a plain wall into something worth stopping for.",
      "Tomorrow, take the same route at a different hour. The place will feel new, even though it has not changed."
    ].join(" ")
  }
];

const featuredStory = stories[0];
const featuredContainer = document.querySelector("#featured-story");
const storyGrid = document.querySelector("#story-grid");
const searchInput = document.querySelector("#story-search");
const categoryFilter = document.querySelector("#category-filter");
const emptyState = document.querySelector("#empty-state");
const storyCount = document.querySelector("#story-count");
const articleDialog = document.querySelector("#article-dialog");
const dialogClose = document.querySelector(".dialog-close");

function element(tag, className, text) {
  const item = document.createElement(tag);
  if (className) item.className = className;
  if (text) item.textContent = text;
  return item;
}

function openStory(story) {
  document.querySelector("#dialog-category").textContent = story.category;
  document.querySelector("#dialog-meta").textContent = `${story.date} · ${story.readTime}`;
  document.querySelector("#dialog-title").textContent = story.title;
  document.querySelector("#dialog-excerpt").textContent = story.excerpt;
  document.querySelector("#dialog-content").replaceChildren(element("p", "", story.content));
  articleDialog.showModal();
}

function readButton(story, className) {
  const button = element("button", className, "Read story →");
  button.type = "button";
  button.addEventListener("click", () => openStory(story));
  return button;
}

function renderFeatured() {
  const card = element("article", "featured-card");
  const image = element("img", "featured-image");
  image.src = featuredStory.image;
  image.alt = featuredStory.alt;
  const copy = element("div", "featured-copy");
  copy.append(
    element("span", "article-category", featuredStory.category),
    element("h3", "", featuredStory.title),
    element("p", "", featuredStory.excerpt),
    element("p", "article-meta", `${featuredStory.date} · ${featuredStory.readTime}`),
    readButton(featuredStory, "text-link")
  );
  card.append(image, copy);
  featuredContainer.replaceChildren(card);
}

function storyCard(story, index) {
  const card = element("article", "story-card");
  card.style.animationDelay = `${index * 40}ms`;
  const button = element("button", "");
  button.type = "button";
  button.setAttribute("aria-label", `Read ${story.title}`);
  button.addEventListener("click", () => openStory(story));
  const imageWrap = element("div", "story-image-wrap");
  const image = element("img", "story-image");
  image.src = story.image;
  image.alt = story.alt;
  image.loading = "lazy";
  imageWrap.append(image);
  button.append(imageWrap, element("h3", "", story.title));
  card.append(
    button,
    element("span", "article-category", story.category),
    element("p", "", story.excerpt),
    element("p", "article-meta", `${story.date} · ${story.readTime}`)
  );
  return card;
}

function renderStories() {
  const term = searchInput.value.trim().toLocaleLowerCase();
  const category = categoryFilter.value;
  const matches = stories.slice(1).filter((story) => {
    const text = `${story.title} ${story.category} ${story.excerpt}`.toLocaleLowerCase();
    return (category === "all" || story.category === category) && text.includes(term);
  });
  storyGrid.replaceChildren(...matches.map(storyCard));
  storyCount.textContent = `${matches.length} ${matches.length === 1 ? "story" : "stories"}`;
  emptyState.hidden = matches.length > 0;
}

renderFeatured();
renderStories();
document.querySelector("#story-filters").addEventListener("submit", (event) => {
  event.preventDefault();
});
searchInput.addEventListener("input", renderStories);
categoryFilter.addEventListener("change", renderStories);
dialogClose.addEventListener("click", () => articleDialog.close());
articleDialog.addEventListener("click", (event) => {
  if (event.target === articleDialog) articleDialog.close();
});
