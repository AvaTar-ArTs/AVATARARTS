import React, { useState } from 'react';
import { db, storage } from '../Firebase/firebase'; // import your firebase config
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import NavBar from '../templates/NavBar';
import Footer from '../templates/Footer';
import Header from '../templates/Header';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';

function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [downloadURL, setDownloadURL] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        // Progress function
      }, 
      (error) => {
        // Error function
        console.log(error);
      }, 
      async () => {
        // Complete function
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURL(url);
        await addDoc(collection(db, 'files'), {
          title: title,
          url: url
        });
        alert('File uploaded successfully!');
      }
    );
  };

  return (
    <div>
      <Header />
      <NavBar />
      <form onSubmit={onSubmit}>
        <h1>Upload your comic book file to cloud-database</h1>
        <input type="file" onChange={onFileChange} />
        <input type="text" placeholder="Enter Title" value={title} onChange={onTitleChange} />
        <button type="submit">Upload</button>
      </form>
      {downloadURL && (
        <div>
          <FacebookShareButton url={downloadURL} quote={title}>
            Share on Facebook
          </FacebookShareButton>
          <TwitterShareButton url={downloadURL} title={title}>
            Share on Twitter
          </TwitterShareButton>
          <LinkedinShareButton url={downloadURL}>
            Share on LinkedIn
          </LinkedinShareButton>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Upload;