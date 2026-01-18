import React, { useState, useEffect } from 'react';
import { db } from '../Firebase/firebase'; // import your firebase config
import { collection, getDocs } from 'firebase/firestore';
import './Search.css';
import NavBar from '../templates/NavBar';
import Footer from '../templates/Footer';
import Header from '../templates/Header';

function Search() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      const filesCollection = collection(db, 'files');
      const fileSnapshot = await getDocs(filesCollection);
      const fileList = fileSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setFiles(fileList);
    };

    fetchFiles();
  }, []);

  const filteredFiles = files.filter(file =>
    file.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
    <Header />
    <NavBar />
    <div className="search-container">
     <h1>Comic Book Search</h1>
      <input
        className="search-input"
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <table className="table">
        <thead>
          <tr>
            <th>Comic Title</th>
            <th>File Download</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.map(file => (
            <tr key={file.id}>
              <td>{file.title}</td>
              <td>
                <a href={file.url} target="_blank" rel="noopener noreferrer">Download</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer />
    </div>
  );
}

export default Search;