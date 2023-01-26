import './App.css';
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
function App() {

  const [books, setBooks] = useState([]);
  const [magazines, setMagazines] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [isbnInput, setIsbnInput] = useState('');
  const [foundBook, setFoundBook] = useState(null);
  const [show, setShow] = useState(false)
  const [showAll, setShowAll] = useState(false)





  async function fetchData() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/authors.csv');
      const authorsCsv = await response.text();
      setAuthors(Papa.parse(authorsCsv).data);

      const response2 = await fetch('https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/books.csv');
      const booksCsv = await response2.text();
      setBooks(Papa.parse(booksCsv).data);

      const response3 = await fetch('https://raw.githubusercontent.com/echocat/nodejs-kata-1/master/data/magazines.csv');
      const magazinesCsv = await response3.text();
      setMagazines(Papa.parse(magazinesCsv).data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    // Fetch and parse the CSV data
    fetchData();
  }, []);


  const printAllBooksAndMagazines = () => {
    fetchData();
    console.log('Books:');

    setShow(true)
    books.forEach((book) => {
      console.log(book);
    });

    console.log('Magazines:');
    magazines.forEach((magazine) => {
      console.log(magazine);
    });
  }


  // search by isbn
  const handleIsbnInput = e => {
    setIsbnInput(e.target.value);
  }

  const handleSubmit = e => {
    e.preventDefault();
    findBookOrMagazineByIsbn(isbnInput);
  }

  const findBookOrMagazineByIsbn = isbn => {

    const foundBook = books.find(book => book.includes(isbn));
    const foundMagazine = magazines.find(magazine => magazine.includes(isbn));
    if (foundBook) {
      console.log('books')

      console.log(foundBook);
    } else if (foundMagazine) {
      console.log('magazines')

      console.log(foundMagazine);
    } else {
      console.log(`No book or magazine found with ISBN ${isbn}.`);
    }
  }

  // search by email
  const handleEmailInput = e => {
    setEmailInput(e.target.value);
  }

  const handleSubmitEmail = e => {
    e.preventDefault();
    findBooksAndMagazinesByAuthorEmail(emailInput)
  }

  const findBooksAndMagazinesByAuthorEmail = email => {
    const foundAuthor = books.filter((author) => author.join().includes(`${email}`));
    const foundBooks = magazines.filter((book) => book.join().includes(`${email}`));
    if (foundAuthor) {
      console.log('books')
      console.log(foundAuthor);
      console.log('magazines')
      console.log(foundBooks);
    } else {
      console.log(`No book or magazine found with email ${email}.`);
    }
  }

  const addBook = (e) => {

    e.preventDefault()
    const data = e.target

    const title = data.title.value
    const isbn = data.isbn.value
    const authors = data.authors.value
    const description = data.description.value

    const book = [title, isbn, authors, description]
    console.log(book);
    console.log("to see All in previous csv file then please printAllBooksAndMagazines");
    setBooks([...books, book]);
  }

  const addMagazine = (e) => {
    e.preventDefault()
    const data = e.target

    const title = data.title.value
    const isbn = data.isbn.value
    const authors = data.authors.value
    const publishedAt = (new Date()).toLocaleDateString()
    const magazine = [title, isbn, authors, publishedAt]
    console.log(magazine);
    console.log("to see All in previous csv file then please printAllBooksAndMagazines");

    setMagazines([...magazines, magazine]);
  }

  const sortBooksAndMagazinesByTitle = () => {
    printAllBooksAndMagazines()
    setTimeout(() => {

      const sortedBooks = books.sort((a, b) => (a[0] > b[0] ? -1 : 1));
      setBooks(sortedBooks);
      const sortedMagazines = magazines.sort((a, b) => (a[0] > b[0] ? -1 : 1));
      setMagazines(sortedMagazines);
      setShowAll(true)
    }, 1000)
  }

  const exportDataToCsv = () => {
    const booksCsv = Papa.unparse(books);
    const magazinesCsv = Papa.unparse(magazines);
    try {

      const data = [[booksCsv], [magazinesCsv]];
      const csvData = data.map(d => d.join(',')).join('\n');
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      FileSaver.saveAs(blob, 'new_file.csv');


    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='w-10/12 mx-auto my-10'>
      <h3 className='text-3xl text-primary font-semibold text-center'>To see all actions Please Open your console</h3>
      {/* divider  */}
      <div className='w-full my-5 border-b-2 border-primary'>

      </div>
      {/* divider  */}
      <div className='flex flex-col  items-center'>
        <h4 className='text-xl text-primary font-semibold py-2'>Print out all books and magazines (on either console UI) </h4>
        {/* Print all books and magazines */}
        <div className='flex justify-center items-center gap-x-5'>
          <div className='my-2'>
            <button className='bg-secondary hover:bg-[#FF8B13] px-3 py-2 text-white rounded-lg font-semibold' onClick={printAllBooksAndMagazines}>Click here to Print all books and magazines</button>
          </div>
          <div className='text-center'>
            <button className='bg-secondary hover:bg-[#FF8B13] px-3 py-2 text-white rounded font-semibold' onClick={sortBooksAndMagazinesByTitle}>Sort books and magazines by title</button>
          </div>
        </div>
      </div>


      {
        show &&
        <div className='grid md:grid-cols-2 gap-x-5 '>
          <div className='border border-primary rounded-lg p-2'>
            <h2 className='text-2xl text-white font-semibold text-center bg-secondary py-2'>
              Magazine
            </h2>
            <div className="w-full sm:overflow-x-scroll md:overflow-x-scroll lg:overflow-x-scroll">
              <div className="border-b border-gray-200 shadow">
                <table className="w-full table-auto bg-[#F3F7FB] divide-y divide-gray-300	">
                  <tbody className="bg-white divide-y divide-primary">
                    {magazines.map((magazine, index) => (
                      <tr key={index} className="whitespace-nowrap ">
                        <td className="px-6 py-4 ">
                          <div className="text-sm font-semibold text-primary ">
                            {magazine[0]}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-primary">
                            {magazine[1]}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-primary">
                          {magazine[2]}
                        </td>
                        <td className="px-6 py-4 ">
                          {magazine[3]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className='border border-primary rounded-lg p-2'>
            <h2 className='text-2xl text-white font-semibold text-center bg-secondary py-2'>
              Books
            </h2>
            <div className="w-full sm:overflow-x-scroll md:overflow-x-scroll lg:overflow-x-scroll">
              <div className="border-b border-gray-200 shadow">
                <table className="w-full table-auto bg-[#F3F7FB] divide-y divide-gray-300	">
                  <tbody className="bg-white divide-y divide-primary">
                    {books.map((book, index) => (
                      <tr key={index} className="whitespace-nowrap ">
                        <td className="px-6 py-4 ">
                          <div className="text-sm font-semibold text-primary ">
                            {book[0]}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-primary">
                            {book[1]}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-primary">
                          {book[2]}
                        </td>
                        <td className="px-6 py-4 ">
                          {book[3]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      }

      {/* divider  */}
      <div className='w-full border-b-2 border-primary my-10'>

      </div>
      {/* divider  */}



      <div className='border-2  my-20 border-primary p-5 rounded-md'>
        <h1 className='text-xl font-semibold text-center bg-secondary text-white py-2 mb-3'>
          To see all actions Please Open your console
        </h1>
        <div className={' grid md:grid-cols-2 gap-x-5 '}>
          {/* Search Book Or Magazine By Isbn */}
          <div>
            <div>
              <h2 className='text-primary text-2xl font-semibold my-3'>
                Search Book Or Magazine by ISBN</h2>
            </div>
            <form onSubmit={handleSubmit}>

              <fieldset className='my-2 w-full md:w-2/3'>
                <label> ISBN:</label>
                <input type="text" value={isbnInput} name='isbn' onChange={handleIsbnInput} className='w-full border border-primary  py-2 my-2 px-2 rounded-lg focus:outline-none' placeholder='Input Your ISBN ...' required />
              </fieldset>
              <div>
                <button className='bg-secondary hover:bg-[#FF8B13] px-3 py-2 text-white rounded font-semibold' type="submit">Search by ISBN</button>
              </div>
            </form>
          </div>

          {/* Find books and magazines by author email */}
          <div>
            <div>
              <h2 className='text-primary text-2xl font-semibold my-3'>
                Find books and magazines by author email
              </h2>
            </div>

            <form onSubmit={handleSubmitEmail}>

              <fieldset className='my-2 w-full md:w-2/3'>
                <label> Author Email:</label>
                <input type="email" value={emailInput} name='email' className='w-full border border-primary  py-2 my-2 px-2 rounded-lg focus:outline-none' placeholder='Input Author Email ...' required onChange={handleEmailInput} />
              </fieldset>
              <div>
                <button className='bg-secondary hover:bg-[#FF8B13] px-3 py-2 text-white rounded font-semibold' type="submit">Search by Author Email</button>
              </div>
            </form>
          </div>
        </div>
      </div>




      {/* Sort books and magazines by title */}
      {/* <div className='text-center my-20'>
        <h2 className='text-primary text-2xl font-semibold my-3'>
          Print out all books and magazines with all their details sorted by title.
        </h2>

        <button className='bg-secondary hover:bg-[#FF8B13] px-3 py-2 text-white rounded font-semibold' onClick={sortBooksAndMagazinesByTitle}>Sort books and magazines by title</button>
      </div> */}
      {/* {
        showAll &&
        <div className='grid md:grid-cols-2 gap-x-5 '>
          <div className='border border-primary rounded-lg p-2'>
            <h2 className='text-2xl text-white font-semibold text-center bg-secondary py-2'>
              Magazine
            </h2>
            <div className="w-full sm:overflow-x-scroll md:overflow-x-scroll lg:overflow-x-scroll">
              <div className="border-b border-gray-200 shadow">
                <table className="w-full table-auto bg-[#F3F7FB] divide-y divide-gray-300	">
                  <tbody className="bg-white divide-y divide-primary">
                    {magazines.map((magazine, index) => (
                      <tr key={index} className="whitespace-nowrap ">
                        <td className="px-6 py-4 ">
                          <div className="text-sm font-semibold text-primary ">
                            {magazine[0]}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-primary">
                            {magazine[1]}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-primary">
                          {magazine[2]}
                        </td>
                        <td className="px-6 py-4 ">
                          {magazine[3]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className='border border-primary rounded-lg p-2'>
            <h2 className='text-2xl text-white font-semibold text-center bg-secondary py-2'>
              Books
            </h2>
            <div className="w-full sm:overflow-x-scroll md:overflow-x-scroll lg:overflow-x-scroll">
              <div className="border-b border-gray-200 shadow">
                <table className="w-full table-auto bg-[#F3F7FB] divide-y divide-gray-300	">
                  <tbody className="bg-white divide-y divide-primary">
                    {books.map((book, index) => (
                      <tr key={index} className="whitespace-nowrap ">
                        <td className="px-6 py-4 ">
                          <div className="text-sm font-semibold text-primary ">
                            {book[0]}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-primary">
                            {book[1]}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-primary">
                          {book[2]}
                        </td>
                        <td className="px-6 py-4 ">
                          {book[3]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      } */}


      {/* divider  */}
      <div className='w-full mt-10 border-b-2 border-primary'>

      </div>
      {/* divider  */}

      <h2 className='text-4xl text-primary font-semibold text-center py-2 mt-5 mb-5'>
        Add a book and a magazine and export it to a new CSV file.
      </h2>

      <div className='border-2 border-primary my-10 p-5 rounded-md'>
        <div className={' grid md:grid-cols-2 gap-x-5 '} >
          {/* Add book */}
          < div className='border-r border-primary'>
            <h2 className='text-2xl text-white font-semibold text-center bg-secondary py-2'>
              Book
            </h2>
            <form onSubmit={(e) => { addBook(e) }}>

              <fieldset className='my-2 w-full md:w-2/3'>
                <label> Title: </label>
                <input type="text" name="title" className='w-full border border-primary  py-2 my-2 px-2 rounded-lg focus:outline-none' placeholder='Enter Title ...' required />
              </fieldset>

              <fieldset className='my-2 w-full md:w-2/3'>
                <label> ISBN:</label>
                <input type="text" name="isbn" className='w-full border border-primary  py-2 my-2 px-2 rounded-lg focus:outline-none' placeholder='Enter ISBN ...' required />
              </fieldset>

              <fieldset className='my-2 w-full md:w-2/3'>
                <label>  Authors:</label>
                <input type="text" name="authors" className='w-full border border-primary  py-2 my-2 px-2 rounded-lg focus:outline-none' placeholder='Enter Authors ...' required />
              </fieldset>

              <fieldset className='my-2 w-full md:w-2/3'>
                <label>Description:</label>
                <input type="text" name="description" className='w-full border border-primary  py-2 my-2 px-2 rounded-lg focus:outline-none' placeholder='Enter Description ...' required />
              </fieldset>

              <button className='bg-secondary hover:bg-[#FF8B13] px-3 py-2 text-white rounded font-semibold' type='submit'>
                Add book
              </button>
            </form>
          </div>

          {/* add a magazine */}
          <div className=''>

            <h2 className='text-2xl text-white font-semibold text-center bg-secondary py-2'>
              Magazine
            </h2>
            <form onSubmit={(e) => { addMagazine(e) }}>

              <fieldset className='my-2 w-full md:w-2/3'>
                <label> Title:</label>
                <input type="text" name="title" className='w-full border border-primary  py-2 my-2 px-2 rounded-lg focus:outline-none' placeholder='Enter Title ...' required />
              </fieldset>

              <fieldset className='my-2 w-full md:w-2/3'>
                <label>   ISBN:</label>
                <input type="text" name="isbn" className='w-full border border-primary  py-2 my-2 px-2 rounded-lg focus:outline-none' placeholder='Enter ISBN ...' required />
              </fieldset>

              <fieldset className='my-2 w-full md:w-2/3'>
                <label>   Authors:</label>
                <input type="text" name="authors" className='w-full border border-primary  py-2 my-2 px-2 rounded-lg focus:outline-none' placeholder='Enter Author ...' required />
              </fieldset>


              <button className='bg-secondary hover:bg-[#FF8B13] px-3 py-2 text-white rounded font-semibold' type='submit'>
                Add magazine
              </button>

            </form>
          </div>
        </div >

      </div>

      <div className='flex justify-center items-center mt-5'>
        <button className='bg-secondary hover:bg-[#FF8B13] text-xl px-5 py-2 text-white rounded font-semibold' onClick={exportDataToCsv}>
          Export data to CSV
        </button>
      </div>

    </div >
  );
}

export default App;