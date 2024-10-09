import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./article.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("mongodb connected");
}

app.get("/books", (req, res) => {
  Book.find().then((result) => {
    res.send(result);
  });
});

app.get("/books/:id", (req, res) => {
  Book.findOne().then((result) => {
    res.send(result);
  });
});

app.post("/books", (req, res) => {
  const book = new Book({
    name: req.body.name,
    author: req.body.author,
    printNum: req.body.printNum,
    datePublish: req.body.datePublish,
    pdf: req.body.pdf,
    price: req.body.price,
    language: req.body.language,
    class: req.body.class,
  });

  book
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.patch("/books/:id", (req, res) => {
  const { id } = req.params;
  Book.findByIdAndUpdate(id, req.body, { new: true, runValidators: true }).then(
    (result) => {
      res.send(result);
    }
  );
});

app.delete("/books/:id", (req, res) => {
  const { id } = req.params;

  Book.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.send("not found");
      }
      res.send("Book deleted successfully");
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
