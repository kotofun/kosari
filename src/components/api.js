export default {
  // отправка результатов на апи
  send: (data) => {
    const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP')
    xhr.open('POST', '/api/score', true)
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
    xhr.send(JSON.stringify(data))
  }
}
