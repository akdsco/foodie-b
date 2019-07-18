import React, { Component } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'
import RestaurantItemInfo from "./RestaurantItemInfo";

export default class RestaurantAccordion extends Component {
  state = { activeIndex: -1 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state

    return (
        <Accordion>
          <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
            <RestaurantItemInfo />
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <p>
              List of reviews here
            </p>
          </Accordion.Content>
        </Accordion>
    )
  }
}
