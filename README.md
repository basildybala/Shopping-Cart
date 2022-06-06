# Chusespo

![Project Image](README_IMAGES/1.jpeg)

Chusespo is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account.
This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

<br>


---

### Table of Contents

- [Description](#Description)
- [Demo](#demo)
- [Project Layout](#project-layout)
- [References](#references)
- [Author Info](#author-info)

---

## Description
<br>
This website is about tourist areas. Here users can create their own tourist spots and comment and rate on others tourist spots. They contain information about the prices, different amenities available, contact details, and the address shown using google maps. I used HTML, CSS, ejs, MongoDB, jQuery, Javascript, Express, Node and NPM. This website is hosted using Heroku.
<br>
<br>

### Live Demo - [Chusespo](https://chusespo.herokuapp.com/)


### Technologies

- Node.js
- Express 
- MongoDB
- Bootstrap
- Passport.js


---

## Demo
<br>
<p align="center">
  <img  src="README_IMAGES\4.jpeg"  > 
</p>
<br>
<p align="center">
  <img  src="README_IMAGES\2.jpeg"  > 
</p>
<br>
<p align="center">
  <img  src="README_IMAGES\3.jpeg"  > 
</p>


---

## Features

- Users can create, edit, and remove campgrounds
- Users can review campgrounds once, and edit or remove their review
- User profiles include more information on the user (full name, email, phone, join date), their campgrounds, and the option to edit their profile or delete their account
- Search campground by name or location
- Sort campgrounds by highest rating, most reviewed, lowest price, or highest price

---

## Project Layout

```
Chusespo
├─ app.js
├─ chusespo
├─ middleware
│  └─ index.js
├─ models
│  ├─ campground.js
│  ├─ comment.js
│  └─ user.js
├─ package-lock.json
├─ package.json
├─ Procfile
├─ public
│  └─ stylesheets
│     ├─ landing.css
│     └─ main.css
├─ README.md
├─ routes
│  ├─ campgrounds.js
│  ├─ comments.js
│  └─ index.js
└─ views
   ├─ about.ejs
   ├─ campgrounds
   │  ├─ edit.ejs
   │  ├─ index.ejs
   │  ├─ new.ejs
   │  └─ show.ejs
   ├─ comments
   │  ├─ edit.ejs
   │  └─ new.ejs
   ├─ error.ejs
   ├─ landing.ejs
   ├─ login.ejs
   ├─ partials
   │  ├─ errorMsg.ejs
   │  ├─ footer.ejs
   │  └─ header.ejs
   ├─ register.ejs
   └─ users
      ├─ edit.ejs
      └─ show.ejs

```

## References

- [EJS](https://ejs.co/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Passport](http://www.passportjs.org/)
- [Express](https://expressjs.com/)

---

## Author Info

- LinkedIn - [Dwaraka Poreddy](https://www.linkedin.com/in/dwarakanath-reddy-poreddy-3bbb231b1/)
- Github - [Dwaraka Poreddy](https://github.com/Dwaraka-Poreddy)

#### [Back To The Top](#Chusespo)

