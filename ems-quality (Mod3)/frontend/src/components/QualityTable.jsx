function QualityTable({ reviews }) {
  return (
    <div>
      <h2>Revisiones registradas</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Project ID</th>
            <th>Requirement ID</th>
            <th>Status</th>
            <th>Comment</th>
          </tr>
        </thead>

        <tbody>
          {reviews.length === 0 ? (
            <tr>
              <td colSpan="5">
                No hay revisiones
              </td>
            </tr>
          ) : (
            reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.projectId}</td>
                <td>{review.requirementId}</td>
                <td>{review.status}</td>
                <td>{review.comment}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default QualityTable;