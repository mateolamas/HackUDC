// Subes csv al dropearlo

const controlDropHouse = (e, setCsv) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    setCsv(file);
  }
};

export default controlDropHouse;