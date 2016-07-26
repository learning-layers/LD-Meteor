import React, {Component} from 'react'
import { Meteor } from 'meteor/meteor'
import { composeWithTracker } from 'react-komposer'
import Loader from 'react-loader'
import DocumentUserSharing from './DocumentUserSharing'
import DocumentGroupSharing from './DocumentGroupSharing'
import { DocumentLinkSharing } from './DocumentLinkSharing'
import Tabs from '../../../../../../node_modules/react-bootstrap/lib/Tabs'
import Tab from '../../../../../../node_modules/react-bootstrap/lib/Tab'
import { DocumentAccess } from '../../../lib/collections'

function onPropsChange (props, onData) {
  let handle = Meteor.subscribe('documentAccess', {documentId: props.documentId})
  if (handle.ready()) {
    let documentAccess = DocumentAccess.findOne({'documentId': props.documentId})
    onData(null, {documentAccess})
  }
}

class DocumentSharing extends Component {
  render () {
    const { documentId, documentAccess } = this.props
    return <div className='document-sharing'>
      <Tabs defaultActiveKey={2} id='document-sharing-tab'>
        <Tab eventKey={1} title='Users'>
          <DocumentUserSharing documentId={documentId} documentAccess={documentAccess} />
        </Tab>
        <Tab eventKey={2} title='Groups'>
          <DocumentGroupSharing documentId={documentId} documentAccess={documentAccess} />
        </Tab>
        <Tab eventKey={3} title='Sharing Urls'>
          <DocumentLinkSharing documentId={documentId} documentAccess={documentAccess} />
        </Tab>
      </Tabs>
    </div>
  }
}

DocumentSharing.propTypes = {
  documentId: React.PropTypes.string,
  documentAccess: React.PropTypes.object
}

const Loading = () => (<Loader loaded={false} options={global.loadingSpinner.options} />)
export default composeWithTracker(onPropsChange, Loading)(DocumentSharing)
