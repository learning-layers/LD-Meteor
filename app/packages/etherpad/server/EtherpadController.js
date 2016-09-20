import { HTTP } from 'meteor/http'
import { Meteor } from 'meteor/meteor'

class EtherpadController {
  constructor () {
    this.endpoint = Meteor.settings.private.etherpad.endpoint
    console.log('Etherpad connection is set to endpoint=' + this.endpoint)
    this.apiKey = Meteor.settings.private.etherpad.apiKey
  }
  createGroup (callback) {
    HTTP.post(this.endpoint + '/createGroup', {
      data: {
        'apikey': this.apiKey
      }
    }, function (error, response) {
      if (error) {
        console.log(error)
        callback(error)
      } else {
        if (response.data.code === 0) {
          // ok status
          callback(null, response.data.data.groupID)
        } else {
          // TODO add error handling
          callback('error')
        }
      }
    })
  }
  createGroupPad (groupId, title, initialContent, callback) {
    // TODO const document = Documents.findOne({'_id': documentId}, {fields: {etherpad_group: 1}})
    let data = {
      apikey: this.apiKey,
      groupID: groupId,
      padName: title
    }
    if (initialContent && initialContent != null) {
      data.text = initialContent
    }
    HTTP.post(this.endpoint + '/createGroupPad', {
      data: data
    }, function (error, response) {
      if (error) {
        console.log(error)
        callback(error)
      } else {
        if (response.data.code === 0) {
          // ok status
          callback(null, response.data.data.padID)
        } else {
          // TODO add error handling
          callback('error')
        }
      }
    })
  }
  createAuthor (userId, userName, callback) {
    HTTP.post(this.endpoint + '/createAuthorIfNotExistsFor', {
      data: {
        'apikey': this.apiKey,
        'name': userName,
        'authorMapper': userId
      }
    }, function (error, response) {
      if (error) {
        console.log(error)
        callback(error)
      } else {
        if (response.data.code === 0) {
          // ok status
          callback(null, response.data.data.authorID)
        } else {
          // TODO add error handling
          callback('error')
        }
      }
    })
  }
  createPadSession (groupId, authorId, validUntil, callback) {
    HTTP.post(this.endpoint + '/createSession', {
      data: {
        'apikey': this.apiKey,
        'groupID': groupId,
        'authorID': authorId,
        'validUntil': validUntil
      }
    }, function (error, response) {
      if (error) {
        console.log(error)
        callback(error)
      } else {
        if (response.data.code === 0) {
          // ok status
          callback(null, response.data.data.sessionID)
        } else {
          // TODO add error handling
          callback('error')
        }
      }
    })
  }
  removeSession (sessionID, callback) {
    HTTP.post(this.endpoint + '/deleteSession', {
      data: {
        'apikey': this.apiKey,
        'sessionID': sessionID
      }
    }, function (error, response) {
      if (error) {
        console.log(error)
        callback(error)
      } else {
        if (response.data.code === 0) {
          // ok status
          callback(null, null)
        } else {
          // TODO add error handling
          callback('error')
        }
      }
    })
  }
  listSessionsOfAuthor (authorID, callback) {
    HTTP.post(this.endpoint + '/listSessionsOfAuthor', {
      data: {
        'apikey': this.apiKey,
        'authorID': authorID
      }
    }, function (error, response) {
      if (error) {
        console.log(error)
        callback(error)
      } else {
        if (response.data.code === 0) {
          // ok status
          callback(null, response.data.data)
        } else {
          // TODO add error handling
          callback('error')
        }
      }
    })
  }
  getHTMLContent (groupPadId, callback) { // get the html representation of the etherpad content
    HTTP.post(this.endpoint + '/getHTML', {
      data: {
        'apikey': this.apiKey,
        'padID': groupPadId
      }
    }, function (error, response) {
      if (error) {
        console.log(error)
        callback(error)
      } else {
        if (response.data.code === 0) {
          // ok status
          callback(null, response.data.data.html)
        } else {
          // TODO add error handling
          console.log(response)
          callback('error')
        }
      }
    })
  }
  getReadOnlyPadId (groupPadId, callback) {
    HTTP.post(this.endpoint + '/getReadOnlyID', {
      data: {
        'apikey': this.apiKey,
        'padID': groupPadId
      }
    }, function (error, response) {
      if (error) {
        console.log(error)
        callback(error)
      } else {
        if (response.data.code === 0) {
          // ok status
          callback(null, response.data.data.readOnlyID)
        } else {
          // TODO add error handling
          callback('error')
        }
      }
    })
  }
}

export const EtherpadControllerInstance = new EtherpadController()
