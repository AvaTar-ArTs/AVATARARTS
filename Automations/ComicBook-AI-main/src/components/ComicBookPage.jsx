import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import NavBar from '../templates/NavBar';
import Footer from '../templates/Footer';
import Header from '../templates/Header';

function ComicBookPage() {
  const [cards, setCards] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState('');
  const cardsRef = useRef();

  const handleUpload = (event) => {
    event.preventDefault();
    const { image, text } = event.target.elements;
    const newCards = Array.from(image.files)
      .filter(file => file instanceof File)
      .map(file => ({ image: URL.createObjectURL(file), text: text.value }));
    setCards(prevCards => [...prevCards, ...newCards]);
    event.target.reset();
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditingText(cards[index].text);
  };

  const handleUpdate = (index) => {
    setCards(prevCards => prevCards.map((card, i) => i === index ? { ...card, text: editingText } : card));
    setEditingIndex(null);
  };

  const saveAsPDF = async () => {
    const pdf = new jsPDF();
    const cardsElements = cardsRef.current.children;

    for (let i = 0; i < cardsElements.length; i++) {
      const canvas = await html2canvas(cardsElements[i]);
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0);
      if (i < cardsElements.length - 1) {
        pdf.addPage();
      }
    }

    pdf.save("cards.pdf");
  };

  return (
    <div>
      <Header />
      <NavBar />
      <form onSubmit={handleUpload}>
        <h1>Upload your comic book generated images</h1>
        <input type="file" name="image" accept="image/*" multiple required />
        <input type="text" name="text" placeholder="Enter image text..." required />
        <button type="submit">Upload</button>
      </form>
      <div ref={cardsRef} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {cards.map((card, index) => (
          <div key={index} style={{ margin: '10px', border: '1px solid black', padding: '10px' }}>
            <img src={card.image} alt="comic" style={{ width: '200px', height: '200px' }} />
            {editingIndex === index ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={() => handleUpdate(index)}
                onKeyPress={(e) => e.key === 'Enter' && handleUpdate(index)}
                autoFocus
              />
            ) : (
              <p onClick={() => handleEdit(index)}>{card.text}</p>
            )}
          </div>
        ))}
      </div>
      <button onClick={saveAsPDF}>Save as PDF</button>
      <Footer />
    </div>
  );
}

export default ComicBookPage;