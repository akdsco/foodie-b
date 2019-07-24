// Import Components

import _ from 'lodash'
import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'

const initialState = { isLoading: false, results: [], value: '' }

const source = [
  {
    title: 'Farmer J',
    description: 'A contemporary place',
    image: './logo.png',
    price: '$25.3'
  },
  {
  title: 'Andy B',
  description: 'Burgers and Wine',
  image: './logo.png',
  price: '$45.3'
  },
  {
    title: 'Makeover',
    description: 'Rural and hearty place',
    image: './logo.png',
    price: '$15.4'
  },
  {
    title: "Mike's Breaky",
    description: 'Eggs and Salmon',
    image: './logo.png',
    price: '$60.0'
  }
];

export default class SearchRestaurants extends Component {
  state = initialState

  handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value })

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.title)

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      })
    }, 300)
  }

  render() {
    const { isLoading, value, results } = this.state

    return (
      <Search
          loading={isLoading}
          fluid={true}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 500, {
            leading: true,
          })}
          results={results}
          value={value}
          {...this.props}
      />
    )
  }
}
