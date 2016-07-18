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
  createGroupPad (groupId, title, callback) {
    // TODO const document = Documents.findOne({'_id': documentId}, {fields: {etherpad_group: 1}})
    HTTP.post(this.endpoint + '/createGroupPad', {
      data: {
        'apikey': this.apiKey,
        'groupID': groupId,
        'padName': title
      }
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
          callback('error')
        }
      }
    })
  }
  getReadOnlyPadId (groupPadId, callback) {
    console.log(JSON.stringify(arguments))
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
