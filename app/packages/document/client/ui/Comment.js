import React, {Component} from 'react'
import Image from '../../../../../node_modules/react-bootstrap/lib/Image'
import ButtonToolbar from '../../../../../node_modules/react-bootstrap/lib/ButtonToolbar'
import Button from '../../../../../node_modules/react-bootstrap/lib/Button'
import { moment } from 'meteor/momentjs:moment'
import Rating from 'react-rating'
import classNames from 'classnames'

class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      replyActive: false
    }
  }
  handleReplyClick () {
    this.setState({
      replyActive: true
    })
  }
  submitReply () {
    window.alert('submit reply')
  }
  closeReply () {
    this.setState({
      replyActive: false
    })
  }
  render () {
    let hrDividerClassNames = classNames({'no-margin-bottom': this.state.replyActive})
    return <div className='comment-wrapper'>
      <div className='comment'>
        <div className='avatar-img-wrapper'>
          <Image src='https://randomuser.me/api/portraits/men/20.jpg' />
        </div>
        <div className='comment-content-wrapper'>
          <h4>Test User</h4>
          <div className='datetime'>
            {moment.max(moment(new Date()).fromNow())}
          </div>
          <div className='content-text'>
            Poutine cray quinoa street art meh. Readymade fashion axe artisan, franzen bushwick lo-fi dreamcatcher aesthetic 3 wolf moon celiac tilde venmo. Cred 8-bit cold-pressed, twee kombucha listicle normcore small batch aesthetic artisan. Heirloom semiotics blog cornhole normcore. Thundercats banjo chartreuse pork belly, poutine williamsburg pabst etsy salvia venmo cornhole cray flexitarian. Brunch aesthetic offal cornhole gluten-free gentrify butcher, selfies chicharrones actually fashion axe art party bespoke chillwave. Chartreuse cronut gastropub mixtape, bicycle rights authentic bespoke messenger bag intelligentsia.
          </div>
          {this.state.replyActive ? null : <div className='options-bar'>
            <ButtonToolbar className='options-buttons'>
              <Button bsSize='small' onClick={() => this.handleReplyClick()}>Reply</Button>
            </ButtonToolbar>
            <div className='rating-wrapper'>
              <div className='rating-lbl-wrapper'>Level of agreement</div>
              <Rating
                fractions={2}
                initialRate={2.5}
                onChange={(rate) => { console.log('changed rating'); console.log(rate) }}
                onClick={(rate) => { console.log('clicked rating'); console.log(rate) }}
                onRate={(rate) => { console.log('rated rating'); console.log(rate) }} />
            </div>
          </div>}
        </div>
        <hr className={hrDividerClassNames} />
      </div>
      {this.state.replyActive ? <div>
        <div className='reply-wrapper'>
          <input className='form-control' placeholder='reply' />
          <ButtonToolbar className='options-bar'>
            <Button bsStyle='success' bsSize='small' onClick={() => this.submitReply()}>Submit Reply</Button>
            <Button bsSize='small' onClick={() => this.closeReply()}>Close</Button>
          </ButtonToolbar>
          <div className='clearfix'></div>
        </div>
        <hr className='no-margin-top' />
      </div> : null}
    </div>
  }
}

export default Comment
