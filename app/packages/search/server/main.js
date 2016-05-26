import { Meteor } from 'meteor/meteor'
import { SearchItems } from '../lib/collections'

Meteor.startup(function () {
  if (SearchItems.find({}).count() < 9) {
    SearchItems.insert({text: 'Neutra health goth 3 wolf moon meditation, plaid lo-fi typewriter roof party aesthetic yr readymade distillery. Gentrify taxidermy sustainable banh mi seitan food truck.'})
    SearchItems.insert({text: 'Ramps kinfolk fap microdosing whatever marfa intelligentsia, forage venmo poutine. Deep v artisan pour-over, cray bushwick narwhal pickled semiotics kombucha godard meh VHS iPhone.'})
    SearchItems.insert({text: 'Selvage pug selfies, art party venmo cronut swag kale chips kinfolk trust fund skateboard. Kickstarter small batch readymade etsy distillery.'})
    SearchItems.insert({text: 'Microdosing VHS gluten-free gochujang, locavore affogato williamsburg banjo bicycle rights tilde normcore celiac tumblr four loko squid. Kitsch venmo readymade scenester tattooed, slow-carb street art brunch.'})
    SearchItems.insert({text: 'Actually chia bicycle rights tofu, jean shorts humblebrag +1 plaid yr four loko polaroid. Blue bottle before they sold out try-hard craft beer vegan. Fap butcher schlitz, cold-pressed aesthetic microdosing gastropub authentic pour-over.'})
    SearchItems.insert({text: 'YOLO skateboard man bun butcher semiotics brunch occupy. Church-key echo park narwhal, godard iPhone master cleanse selvage vegan celiac direct trade flexitarian fanny pack freegan slow-carb artisan.'})
    SearchItems.insert({text: 'Portland forage try-hard yuccie, cray health goth before they sold out literally cliche bicycle rights bitters sriracha. Tattooed pitchfork street art, viral tousled semiotics distillery salvia.'})
    SearchItems.insert({text: 'Scenester mlkshk literally ramps, bespoke single-origin coffee lo-fi. Kale chips tattooed crucifix ugh echo park portland authentic freegan ramps. Crucifix gentrify locavore pitchfork. Ethical shoreditch brunch cold-pressed hammock cornhole crucifix.'})
    SearchItems.insert({text: 'Kale chips chia actually, tattooed pork belly disrupt vegan hoodie yuccie.'})
  }
})

let availableSearchLanguages = []
availableSearchLanguages['da'] = 'danish'
availableSearchLanguages['nl'] = 'dutch'
availableSearchLanguages['en'] = 'english'
availableSearchLanguages['fi'] = 'finnish'
availableSearchLanguages['de'] = 'german'
availableSearchLanguages['hu'] = 'hungarian'
availableSearchLanguages['it'] = 'italian'
availableSearchLanguages['nb'] = 'norwegian'
availableSearchLanguages['pt'] = 'portuguese'
availableSearchLanguages['ro'] = 'romanian'
availableSearchLanguages['ru'] = 'russian'
availableSearchLanguages['es'] = 'spanish'
availableSearchLanguages['sv'] = 'swedish'
availableSearchLanguages['tr'] = 'turkish'

Meteor.publish('search', function (args) {
  if (!args.lang) {
    args.lang = 'en'
  }
  if (args.search === '') {
    return SearchItems.find({})
  } else {
    return SearchItems.find({$text: { $search: args.search, $language: args.language }})
  }
})
