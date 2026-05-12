const Note = (props) => {
  const confirm = (message) => {
    if (window.confirm(message)) {
      props.onDelete()
      return
    } else {
      return
    }
  }

  return <li key={props.id}>
    {props.content}
    <button id="deleteButton" onClick={() => confirm('Do you want to delete this person?')}>delete</button>
    <pre id="log"></pre>
  </li>
}

export default Note
