const Notification = ({ messageError, messageSuccess }) => {
  if (messageError === '' && messageSuccess === '') {
    return null
  }

  return (
    <>
      {messageError && <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '5px', backgroundColor: '#cccccc' }}>{messageError}</div>}
      {messageSuccess && <div style={{ color: 'green', padding: '10px', border: '1px solid green', borderRadius: '5px', backgroundColor: '#cccccc' }}>{messageSuccess}</div>}
    </>
  )
}

export default Notification
