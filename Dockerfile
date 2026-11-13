FROM node:22.23.2-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production PORT=8080

COPY --chown=node:node index.html script.js styles.css server.js ./

USER node
EXPOSE 8080
CMD ["node", "server.js"]
