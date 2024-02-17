const TableComponent = ({ data }) => {
  // Procesar los datos
  const labels = data.map(item => item.fecha);
  const values = data.map(item => parseFloat(item.consumo_total));

  // Renderizar la tabla HTML
  return (
      <div className="table-container">
          <table className="table">
              <thead>
                  <tr>
                      <th>Fecha</th>
                      <th>Consumo Medio/Día (KWh)</th>
                  </tr>
              </thead>
              <tbody>
                  {labels.map((label, index) => (
                      <tr key={index}>
                          <td>{label}</td>
                          <td>{values[index]}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );
};

export default TableComponent;