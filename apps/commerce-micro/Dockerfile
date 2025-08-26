FROM node:22

WORKDIR /usr/src/app

# انسخ فقط ملفات البكج
COPY package*.json ./

# ثبّت التبعيات (مع devDependencies)
RUN npm install

# نزّل Nest CLI عالمي
RUN npm install -g @nestjs/cli

# الكود نفسه رح ييجي من الـ volume (docker-compose) مش من COPY
CMD ["npm", "run", "start:dev", "--", "commerce-micro"]
