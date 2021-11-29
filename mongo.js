const mongoose = require('mongoose');

const password = process.argv[2];
let name = '';
let number = '';
if (process.argv.length === 5) {
  name = process.argv[3];
  number = process.argv[4];
}

// qwerqwer
const url = `mongodb+srv://vietduc:${password}@cluster0.w0k5p.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 5) {
  const person = new Person({
    name,
    number,
  });

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((p) => console.log(p.name, p.number));
    mongoose.connection.close();
  });
}
